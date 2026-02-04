import { useMemo } from 'react';
import {
    Users,
    Building2,
    CheckCircle,
    Clock,
    Shield
} from 'lucide-react';
import DashboardCard from '../../components/ui/DashboardCard';
import { getMockPendaftaran, mockUsers, mockFaskes } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardAdmin.css';

export default function DashboardAdmin() {
    const { user } = useAuth();
    const data = getMockPendaftaran();

    const stats = useMemo(() => {
        return {
            totalUsers: mockUsers.length,
            totalFaskes: mockFaskes.length,
            totalPendaftaran: data.length,
            pendingVerifikasi: data.filter(d => d.status_id === 1).length,
            selesai: data.filter(d => d.status_id === 5).length
        };
    }, [data]);

    return (
        <div className="dashboard-admin">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard Admin</h1>
                    <p className="page-subtitle">Selamat datang, {user?.name}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <DashboardCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="primary"
                    subtitle="Semua pengguna"
                />
                <DashboardCard
                    title="Total Faskes"
                    value={stats.totalFaskes}
                    icon={Building2}
                    color="info"
                    subtitle="RS + Puskesmas"
                />
                <DashboardCard
                    title="Total Pendaftaran"
                    value={stats.totalPendaftaran}
                    icon={Shield}
                    color="success"
                    subtitle="Semua usulan"
                />
                <DashboardCard
                    title="Pending Verifikasi"
                    value={stats.pendingVerifikasi}
                    icon={Clock}
                    color="warning"
                    subtitle="Menunggu proses"
                />
            </div>

            {/* Quick Stats */}
            <div className="admin-grid">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Ringkasan Pengguna</h3>
                    </div>
                    <div className="user-stats">
                        <div className="stat-item">
                            <span className="stat-label">Super Admin</span>
                            <span className="stat-value">{mockUsers.filter(u => u.role === 'super_admin').length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Verifikator Dinkes</span>
                            <span className="stat-value">{mockUsers.filter(u => u.role === 'verifikator_dinkes').length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Verifikator BPJS</span>
                            <span className="stat-value">{mockUsers.filter(u => u.role === 'verifikator_bpjs').length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Petugas RS</span>
                            <span className="stat-value">{mockUsers.filter(u => u.role === 'faskes_rs').length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Petugas Puskesmas</span>
                            <span className="stat-value">{mockUsers.filter(u => u.role === 'faskes_pkm').length}</span>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Ringkasan Faskes</h3>
                    </div>
                    <div className="user-stats">
                        <div className="stat-item">
                            <span className="stat-label">Rumah Sakit</span>
                            <span className="stat-value">{mockFaskes.filter(f => f.type === 'RS').length}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Puskesmas</span>
                            <span className="stat-value">{mockFaskes.filter(f => f.type === 'PKM').length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
