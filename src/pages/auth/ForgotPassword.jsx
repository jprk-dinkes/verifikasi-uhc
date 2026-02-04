import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import './LoginPage.css'; // Reusing login styles for consistency

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setSubmitted(true);
        setLoading(false);
    };

    if (submitted) {
        return (
            <div className="login-page">
                <div className="login-card animate-fade-in-up">
                    <div className="login-header text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <CheckCircle size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Permintaan Terkirim</h2>
                        <p className="subtitle mt-2">
                            Jika akun dengan username/email <strong>{identifier}</strong> ditemukan, kami telah mengirimkan instruksi reset password ke email terkait.
                        </p>
                    </div>

                    <button
                        className="btn btn-primary w-full mt-6"
                        onClick={() => navigate('/login')}
                    >
                        Kembali ke Login
                    </button>

                    <div className="login-footer mt-4">
                        <p>Demo: Hubungi Admin untuk reset langsung.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-card animate-fade-in-up">
                <div className="login-header">
                    <button className="btn btn-ghost btn-sm mb-4 -ml-2" onClick={() => navigate('/login')}>
                        <ArrowLeft size={16} /> Kembali
                    </button>
                    <h1 className="login-title">Lupa Password</h1>
                    <p className="subtitle">Masukkan username atau email Anda untuk mereset password.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Username / Email</label>
                        <div className="input-group">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="text"
                                className="form-input with-icon"
                                placeholder="Masukkan username atau email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading || !identifier}
                    >
                        {loading ? 'Memproses...' : 'Kirim Link Reset'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Masalah login? <br />
                        Hubungi Tim IT Dinas Kesehatan
                    </p>
                </div>
            </div>
        </div>
    );
}
