import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import Sidebar from './Sidebar';
import GlobalSearch from '../ui/GlobalSearch';
import './MainLayout.css';

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export default function MainLayout({ allowedRoles }) {
    const { user, loading, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [lastActivity, setLastActivity] = useState(Date.now());

    // Session timeout handler
    const handleActivity = useCallback(() => {
        setLastActivity(Date.now());
    }, []);

    useEffect(() => {
        // Activity listeners
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Check for session timeout every minute
        const interval = setInterval(() => {
            if (Date.now() - lastActivity > SESSION_TIMEOUT) {
                logout();
                navigate('/login', { state: { message: 'Sesi Anda telah berakhir karena tidak aktif selama 1 jam.' } });
            }
        }, 60000);

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            clearInterval(interval);
        };
    }, [lastActivity, logout, navigate, handleActivity]);

    // Global search keyboard shortcut (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
            }
            if (e.key === 'Escape') {
                setShowSearch(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <main className="main-content" style={{ marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)', transition: 'margin-left 0.3s ease' }}>
                {/* Top Header with Global Search */}
                <header className="main-header">
                    <div className="header-search">
                        <button
                            className="search-trigger"
                            onClick={() => setShowSearch(true)}
                        >
                            <Search size={18} />
                            <span>Cari pasien, NIK, No. Reg...</span>
                            <kbd>⌘K</kbd>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="page-content">
                    <Outlet />
                </div>

                {/* Developer Footer */}
                <footer className="main-footer">
                    <p>© 2026 Sistem Verifikasi UHC • Pengembang: <strong>Rafied Ridwan F, A.Md.RMIK</strong></p>
                </footer>
            </main>

            {/* Global Search Modal */}
            {showSearch && (
                <GlobalSearch onClose={() => setShowSearch(false)} />
            )}
        </div>
    );
}
