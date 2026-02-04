import { useState, useEffect } from 'react';
import { X, Save, User, Lock, Building2, Briefcase } from 'lucide-react';
import { mockFaskes } from '../../data/mockData';
import './UserFormModal.css';

export default function UserFormModal({ user, onClose, onSave }) {
    const isEditMode = !!user;
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        role: 'verifikator_dinkes',
        password: '',
        faskesId: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                role: user.role || 'verifikator_dinkes',
                password: '', // Don't show existing password
                faskesId: user.faskesId || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.username) {
            alert('Nama dan Username wajib diisi');
            return;
        }

        if (!isEditMode && !formData.password) {
            alert('Password wajib diisi untuk user baru');
            return;
        }

        // Prepare payload
        const payload = {
            ...formData,
            // If editing and no password provided, remove it from updates so it doesn't get overwritten with empty
            ...(isEditMode && !formData.password && { password: undefined })
        };

        // If faskes role selected, find faskes name
        if (['faskes_rs', 'faskes_pkm'].includes(formData.role) && formData.faskesId) {
            const faskes = mockFaskes.find(f => f.id === formData.faskesId);
            if (faskes) {
                payload.faskesName = faskes.name;
            }
        } else {
            payload.faskesId = undefined;
            payload.faskesName = undefined;
        }

        // Clean undefined password
        if (payload.password === undefined) delete payload.password;

        onSave(payload);
    };

    // Filter faskes based on role
    const filteredFaskes = mockFaskes.filter(f => {
        if (formData.role === 'faskes_rs') return f.type === 'RS';
        if (formData.role === 'faskes_pkm') return f.type === 'PKM';
        return false;
    });

    return (
        <div className="modal-overlay">
            <div className="modal user-form-modal">
                <div className="modal-header">
                    <div className="modal-title">
                        <User size={24} />
                        <h3>{isEditMode ? 'Edit User' : 'Tambah User Baru'}</h3>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body">
                    <div className="form-group">
                        <label className="form-label required">Nama Lengkap</label>
                        <div className="input-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                name="name"
                                className="form-input with-icon"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Contoh: Dr. Budi Santoso"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Username</label>
                        <div className="input-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                name="username"
                                className="form-input with-icon"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username untuk login"
                                required
                                disabled={isEditMode && user.role === 'super_admin'} // Prevent changing admin username
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label required">Role / Peran</label>
                        <div className="input-group">
                            <Briefcase size={18} className="input-icon" />
                            <select
                                name="role"
                                className="form-select with-icon"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={isEditMode && user.role === 'super_admin'} // Prevent changing super admin role
                            >
                                <option value="verifikator_dinkes">Verifikator Dinkes</option>
                                <option value="verifikator_bpjs">Verifikator BPJS</option>
                                <option value="faskes_rs">Petugas Rumah Sakit</option>
                                <option value="faskes_pkm">Petugas Puskesmas</option>
                                <option value="front_office">Front Office</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                    </div>

                    {/* Faskes Selection - Only for Faskes roles */}
                    {['faskes_rs', 'faskes_pkm'].includes(formData.role) && (
                        <div className="form-group animate-fade-in">
                            <label className="form-label required">Pilih Faskes</label>
                            <div className="input-group">
                                <Building2 size={18} className="input-icon" />
                                <select
                                    name="faskesId"
                                    className="form-select with-icon"
                                    value={formData.faskesId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Pilih Faskes --</option>
                                    {filteredFaskes.map(f => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            {isEditMode ? 'Password (Kosongkan jika tidak ubah)' : 'Password'}
                            {!isEditMode && <span className="text-danger"> *</span>}
                        </label>
                        <div className="input-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                className="form-input with-icon"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={isEditMode ? "••••••••" : "Masukkan password"}
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="modal-footer" style={{ padding: 0, marginTop: '2rem', border: 'none' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} />
                            {isEditMode ? 'Simpan Perubahan' : 'Tambah User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
