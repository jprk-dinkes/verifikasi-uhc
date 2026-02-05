import { db } from './firebase';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Helper to create secondary app for creating users without logging out admin
const createSecondaryAuth = () => {
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    // Check if app already initialized related workaround not needed if using standard SDK correctly
    // But for client-side admin creation, we need a separate instance
    const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp");
    return getAuth(secondaryApp);
};

export const fetchUsers = async () => {
    try {
        const q = query(collection(db, 'users'), orderBy('username'));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const createFirebaseUser = async (userData) => {
    // 1. Create Auth User using secondary app
    const secondaryAuth = createSecondaryAuth();
    const email = userData.username.includes('@') ? userData.username : `${userData.username}@verifikasi-uhc.com`;
    const password = userData.password || '123456'; // Default password if missing

    try {
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const uid = userCredential.user.uid;

        // 2. Create Firestore Doc
        // Note: We use the main 'db' instance here, not secondary
        await setDoc(doc(db, 'users', uid), {
            username: userData.username,
            name: userData.name,
            role: userData.role,
            email: email,
            faskesId: userData.faskesId || null,
            faskesName: userData.faskesName || null,
            createdAt: new Date().toISOString()
        });

        return { success: true, uid };
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

export const updateFirebaseUser = async (uid, updates) => {
    try {
        const userRef = doc(db, 'users', uid);
        // Exclude password from firestore update as it's handled in Auth (complex to update from admin side without backend)
        const { password, ...safeUpdates } = updates;

        await updateDoc(userRef, safeUpdates);
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteFirebaseUser = async (uid) => {
    try {
        await deleteDoc(doc(db, 'users', uid));
        // Note: This only deletes Firestore doc. Auth user remains. 
        // Deleting Auth user requires Admin SDK functions which we don't have in frontend-only.
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
