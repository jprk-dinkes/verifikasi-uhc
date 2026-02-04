import { useState } from 'react';
import { User, Lock, Save, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './SettingAkun.css';

export default function SettingAkun() {
    const { user, updateProfile } = useAuth();

    const [name, setName] = useState(user?.name || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [profileSaved, setProfileSaved] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [error, setError] = useState('');

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        updateProfile({ name });
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2000);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Password baru tidak cocok dengan konfirmasi');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        // In real app, verify current password and update
        setPasswordChanged(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordChanged(false), 2000);
    };

    return (
        <div className="setting-page">
            <div className="page-header">
                <h1 className="page-title">Setting Akun</h1>
                <p className="page-subtitle">Kelola profil dan keamanan akun Anda</p>
            </div>

            <div className="settings-grid">
                {/* Profile Section */}
                <div className="card setting-card animate-fade-in-up">
                    <div className="card-header">
                        <h3 className="card-title">
                            <User size={18} />
                            Profil Petugas
                        </h3>
                    </div>

                    <form onSubmit={handleProfileSubmit}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-input"
                                value={user?.username || ''}
                                disabled
                            />
                            <span className="form-hint">Username tidak dapat diubah</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nama Lengkap</label>
                            <input
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>

                        {user?.faskesName && (
                            <div className="form-group">
                                <label className="form-label">Faskes</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={user.faskesName}
                                    disabled
                                />
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary">
                            {profileSaved ? (
                                <>
                                    <Check size={16} /> Tersimpan
                                </>
                            ) : (
                                <>
                                    <Save size={16} /> Simpan Profil
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Password Section */}
                <div className="card setting-card animate-fade-in-up stagger-1">
                    <div className="card-header">
                        <h3 className="card-title">
                            <Lock size={18} />
                            Ubah Password
                        </h3>
                    </div>

                    <form onSubmit={handlePasswordSubmit}>
                        {error && (
                            <div className="form-error-box">{error}</div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Password Saat Ini</label>
                            <input
                                type="password"
                                className="form-input"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Masukkan password saat ini"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password Baru</label>
                            <input
                                type="password"
                                className="form-input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Masukkan password baru"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Konfirmasi password baru"
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            {passwordChanged ? (
                                <>
                                    <Check size={16} /> Password Diubah
                                </>
                            ) : (
                                <>
                                    <Lock size={16} /> Ubah Password
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
