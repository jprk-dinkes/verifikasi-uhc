import { useMemo } from 'react';
import {
    Users,
    CheckCircle,
    Clock,
    AlertCircle
} from 'lucide-react';
import DashboardCard from '../../components/ui/DashboardCard';
import { TrendChart } from '../../components/charts/Charts';
import { getMockPendaftaran } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardBPJS.css';

export default function DashboardBPJS() {
    const { user } = useAuth();
    const data = getMockPendaftaran();

    const stats = useMemo(() => {
        // Data yang sudah lolos Dinkes (status 2) menunggu verifikasi BPJS
        const menunggu = data.filter(d => d.status_id === 2).length;
        const terbit = data.filter(d => d.status_id === 5).length;
        const pendingBpjs = data.filter(d => d.status_id === 6).length;

        // Total jiwa yang sudah terbit
        const jiwaTerbit = data
            .filter(d => d.status_id === 5)
            .reduce((sum, d) => sum + d.jml_didaftarkan, 0);

        return {
            menunggu,
            terbit,
            pendingBpjs,
            jiwaTerbit,
            total: menunggu + terbit + pendingBpjs
        };
    }, [data]);

    // Trend data (last 7 days)
    const trendData = useMemo(() => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = data.filter(d =>
                d.tgl_verif_bpjs?.split('T')[0] === dateStr && d.status_id === 5
            ).length;
            days.push({
                name: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                value: count
            });
        }
        return days;
    }, [data]);

    return (
        <div className="dashboard-bpjs">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard BPJS</h1>
                    <p className="page-subtitle">Selamat datang, {user?.name}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <DashboardCard
                    title="Menunggu Verifikasi"
                    value={stats.menunggu}
                    icon={Clock}
                    color="primary"
                    subtitle="Sudah lolos Dinkes"
                />
                <DashboardCard
                    title="Terbit No. BPJS"
                    value={stats.terbit}
                    icon={CheckCircle}
                    color="success"
                    trend="up"
                    trendValue="+5%"
                    subtitle="Berhasil diproses"
                />
                <DashboardCard
                    title="Pending BPJS"
                    value={stats.pendingBpjs}
                    icon={AlertCircle}
                    color="warning"
                    subtitle="Perlu re-upload"
                />
                <DashboardCard
                    title="Total Jiwa Terbit"
                    value={stats.jiwaTerbit}
                    icon={Users}
                    color="success"
                    subtitle="Peserta baru UHC"
                />
            </div>

            {/* Chart */}
            <div className="chart-section">
                <TrendChart
                    data={trendData}
                    title="Penerbitan No. BPJS 7 Hari Terakhir"
                />
            </div>
        </div>
    );
}
