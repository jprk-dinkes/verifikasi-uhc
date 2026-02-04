import { useMemo } from 'react';
import {
    Users,
    Building2,
    Building,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Search
} from 'lucide-react';
import DashboardCard from '../../components/ui/DashboardCard';
import { getMockPendaftaran } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import '../dinkes/DashboardDinkes.css'; // Reuse existing styles

export default function DashboardFrontOffice() {
    const { user } = useAuth();
    const data = getMockPendaftaran();

    const stats = useMemo(() => {
        const rsData = data.filter(d => d.tipe_faskes === 'RS');
        const pkmData = data.filter(d => d.tipe_faskes === 'PKM');

        const belumProses = data.filter(d => d.status_id === 1).length;
        const lolosDinkes = data.filter(d => d.status_id === 2).length;
        const pendingDinkes = data.filter(d => d.status_id === 3).length;
        const tidakLayak = data.filter(d => d.status_id === 4).length;
        const terbit = data.filter(d => d.status_id === 5).length;

        // Front Office cares about quick totals
        return {
            total: data.length,
            rs: rsData.length,
            pkm: pkmData.length,
            belumProses,
            lolosDinkes,
            pendingDinkes,
            tidakLayak,
            terbit
        };
    }, [data]);

    return (
        <div className="dashboard-dinkes">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h1 className="page-title">Front Office Dashboard</h1>
                        <p className="page-subtitle">Selamat bertugas, {user?.name}</p>
                    </div>
                </div>
            </div>

            {/* Executive Stats */}
            <div className="executive-stats">
                <DashboardCard
                    title="Total Usulan Masuk"
                    value={stats.total}
                    icon={Users}
                    color="primary"
                    subtitle="Semua data terdaftar"
                    className="card-accent"
                />
                <DashboardCard
                    title="Usulan RS"
                    value={stats.rs}
                    icon={Building2}
                    color="info"
                    subtitle="Dari Rumah Sakit"
                />
                <DashboardCard
                    title="Usulan Puskesmas"
                    value={stats.pkm}
                    icon={Building}
                    color="success"
                    subtitle="Dari Puskesmas"
                />
                <DashboardCard
                    title="Belum Diproses"
                    value={stats.belumProses}
                    icon={Clock}
                    color="warning"
                    subtitle="Menunggu verifikasi"
                />
            </div>

            {/* Quick Status Overview */}
            <div className="status-overview mt-6">
                <div className="status-item success">
                    <CheckCircle size={20} />
                    <div className="status-info">
                        <span className="status-value">{stats.lolosDinkes}</span>
                        <span className="status-label">Lolos Dinkes</span>
                    </div>
                </div>
                <div className="status-item warning">
                    <AlertCircle size={20} />
                    <div className="status-info">
                        <span className="status-value">{stats.pendingDinkes}</span>
                        <span className="status-label">Pending Dinkes</span>
                    </div>
                </div>
                <div className="status-item danger">
                    <XCircle size={20} />
                    <div className="status-info">
                        <span className="status-value">{stats.tidakLayak}</span>
                        <span className="status-label">Tidak Layak</span>
                    </div>
                </div>
                <div className="status-item info">
                    <CheckCircle size={20} />
                    <div className="status-info">
                        <span className="status-value">{stats.terbit}</span>
                        <span className="status-label">Terbit No BPJS</span>
                    </div>
                </div>
            </div>


        </div>
    );
}
