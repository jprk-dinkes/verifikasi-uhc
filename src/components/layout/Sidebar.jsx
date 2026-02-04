import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    FileText,
    History,
    FileSpreadsheet,
    Settings,
    LogOut,
    Building2,
    Users,
    ClipboardCheck,
    Shield,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';
import './Sidebar.css';
import dinkesLogo from '../../assets/logo-dinkes.png';

export default function Sidebar() {
    const { user, logout, getRoleName } = useAuth();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const menuItems = {
        verifikator_dinkes: [
            { path: '/dinkes', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/dinkes/usulan-rs', icon: Building2, label: 'Usulan Data RS' },
            { path: '/dinkes/usulan-pkm', icon: Building2, label: 'Usulan Data PKM' },
            { path: '/dinkes/riwayat', icon: History, label: 'Riwayat' },
            { path: '/dinkes/laporan', icon: FileSpreadsheet, label: 'Laporan' },
            { path: '/dinkes/setting', icon: Settings, label: 'Setting Akun' }
        ],
        faskes_rs: [
            { path: '/faskes', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/faskes/pendaftaran', icon: FileText, label: 'Form Pendaftaran' },
            { path: '/faskes/riwayat', icon: History, label: 'Riwayat Usulan' },
            { path: '/faskes/setting', icon: Settings, label: 'Setting Akun' }
        ],
        faskes_pkm: [
            { path: '/faskes', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/faskes/pendaftaran', icon: FileText, label: 'Form Pendaftaran' },
            { path: '/faskes/riwayat', icon: History, label: 'Riwayat Usulan' },
            { path: '/faskes/setting', icon: Settings, label: 'Setting Akun' }
        ],
        verifikator_bpjs: [
            { path: '/bpjs', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/bpjs/verifikasi', icon: ClipboardCheck, label: 'Data Verifikasi' },
            { path: '/bpjs/riwayat', icon: History, label: 'Riwayat' },
            { path: '/bpjs/setting', icon: Settings, label: 'Setting Akun' }
        ],
        super_admin: [
            { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/admin/users', icon: Users, label: 'Manajemen User' },
            { path: '/admin/faskes', icon: Building2, label: 'Manajemen Faskes' },
            { path: '/admin/setting', icon: Settings, label: 'Setting Akun' }
        ],
        front_office: [
            { path: '/front-office', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/front-office/usulan-rs', icon: Building2, label: 'Data Usulan RS' },
            { path: '/front-office/usulan-pkm', icon: Building2, label: 'Data Usulan PKM' },
            { path: '/front-office/riwayat', icon: History, label: 'Riwayat' }
        ]
    };

    const currentMenu = menuItems[user?.role] || [];
    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div className="sidebar-overlay" onClick={closeMobile} />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-logo">
                    <div className="logo-content">
                        <div className="logo-icon">
                            <img src={dinkesLogo} alt="Logo Dinkes" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div className="logo-text">
                            <h1>Verifikasi UHC</h1>
                            <span>Universal Health Coverage</span>
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="sidebar-user">
                    <div className="user-card">
                        <div className="user-avatar">
                            {getInitials(user?.name)}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{getRoleName(user?.role)}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <div className="nav-section">
                        <span className="nav-section-title">Menu</span>
                        {currentMenu.map((item, index) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dinkes' || item.path === '/faskes' || item.path === '/bpjs' || item.path === '/admin'}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={closeMobile}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <item.icon className="nav-icon" size={18} />
                                <span>{item.label}</span>
                                {item.notif > 0 && (
                                    <span className="nav-badge">{item.notif}</span>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={logout}>
                        <LogOut size={18} />
                        Keluar
                    </button>
                    <div className="developer-credit">
                        Pengembang: <strong>Rafied Ridwan F, A.Md.RMIK</strong>
                    </div>
                </div>
            </aside>
        </>
    );
}
