import React, { useState } from 'react';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { getMockUsers, getMockPendaftaran } from '../../data/mockData';

const FirebaseMigration = () => {
    const [status, setStatus] = useState('idle');
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);

    const addLog = (msg) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
        console.log(msg);
    };

    const migrateUsers = async () => {
        const users = getMockUsers();
        let successCount = 0;
        let failCount = 0;

        addLog(`Starting migration for ${users.length} users...`);

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const email = `${user.username}@verifikasi-uhc.com`; // Mock email
            // Password min 6 chars, our mock passwords are usually ok aka 'admin123', 'rs12345'
            const password = user.password.length < 6 ? user.password + '123' : user.password;

            try {
                // 1. Create Auth User
                addLog(`Creating auth for: ${user.username}...`);
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;

                // 2. Create Firestore Doc
                await setDoc(doc(db, 'users', uid), {
                    username: user.username,
                    role: user.role,
                    name: user.name,
                    email: email,
                    // Optional fields
                    faskesId: user.faskesId || null,
                    faskesName: user.faskesName || null,
                    createdAt: new Date().toISOString()
                });

                successCount++;
                addLog(`✅ Success: ${user.username} (UID: ${uid})`);
            } catch (error) {
                failCount++;
                addLog(`❌ Failed ${user.username}: ${error.message}`);
            }

            setProgress(Math.round(((i + 1) / users.length) * 50)); // First 50%
        }

        return { successCount, failCount };
    };

    const migratePendaftaran = async () => {
        const data = getMockPendaftaran();
        let successCount = 0;

        addLog(`Starting migration for ${data.length} pendaftaran records...`);

        // If no data, likely empty array in mockData
        if (data.length === 0) {
            addLog("⚠️ No pendaftaran data found in mock (empty array). Skipping.");
            return { successCount: 0 };
        }

        for (let i = 0; i < data.length; i++) {
            try {
                await addDoc(collection(db, 'pendaftaran'), {
                    ...data[i],
                    migratedAt: new Date().toISOString()
                });
                successCount++;
            } catch (error) {
                addLog(`❌ Failed to add pendaftaran record: ${error.message}`);
            }
            setProgress(50 + Math.round(((i + 1) / data.length) * 50)); // Last 50%
        }

        addLog(`✅ Migrated ${successCount} records.`);
        return { successCount };
    };

    const startMigration = async () => {
        if (!window.confirm("Yakin ingin migrasi data ke Firebase? Pastikan config firebase.js sudah benar.")) return;

        setStatus('running');
        setLogs([]);
        setProgress(0);

        try {
            const userResult = await migrateUsers();
            const dataResult = await migratePendaftaran();

            addLog('--- MIGRATION COMPLETED ---');
            addLog(`Users: ${userResult.successCount} success, ${userResult.failCount} failed`);
            addLog(`Data: ${dataResult.successCount} records`);
            setStatus('done');
            setProgress(100);
        } catch (error) {
            addLog(`❌ CRITICAL ERROR: ${error.message}`);
            setStatus('error');
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace' }}>
            <h1>🔥 Firebase Database Seeder</h1>
            <p>Tools ini akan memindahkan data dari <code>mockData.js</code> ke Firebase Firestore & Auth.</p>

            <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
                <h3>Status: {status.toUpperCase()}</h3>
                <div style={{ width: '100%', height: '20px', background: '#ddd', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: '#4CAF50', transition: 'width 0.3s' }}></div>
                </div>
                <p>{progress}% Completed</p>
                <button
                    onClick={startMigration}
                    disabled={status === 'running'}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        background: status === 'running' ? '#ccc' : '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: status === 'running' ? 'not-allowed' : 'pointer'
                    }}
                >
                    {status === 'running' ? 'Migrating...' : 'START MIGRATION'}
                </button>
            </div>

            <div style={{
                background: '#1e1e1e',
                color: '#0f0',
                padding: '20px',
                borderRadius: '8px',
                height: '400px',
                overflowY: 'auto'
            }}>
                {logs.map((log, idx) => (
                    <div key={idx} style={{ marginBottom: '5px' }}>{log}</div>
                ))}
            </div>
        </div>
    );
};

export default FirebaseMigration;
