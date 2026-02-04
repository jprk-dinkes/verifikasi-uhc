import { useMemo } from 'react';
import {
    ClipboardList,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle
} from 'lucide-react';
import DashboardCard from '../../components/ui/DashboardCard';
import { TrendChart } from '../../components/charts/Charts';
import { getMockPendaftaran } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import './DashboardFaskes.css';

export default function DashboardFaskes() {
    const { user } = useAuth();

    // Filter data by faskes
    const data = useMemo(() => {
        return getMockPendaftaran().filter(d => d.id_faskes_pengusul === user?.faskesId);
    }, [user?.faskesId]);

    const stats = useMemo(() => {
        return {
            total: data.length,
            belumProses: data.filter(d => d.status_id === 1).length,
            lolos: data.filter(d => [2, 5].includes(d.status_id)).length,
            pending: data.filter(d => [3, 6].includes(d.status_id)).length,
            tidakLayak: data.filter(d => d.status_id === 4).length,
            terbit: data.filter(d => d.status_id === 5).length
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
                d.tgl_masuk.split('T')[0] === dateStr
            ).length;
            days.push({
                name: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                value: count
            });
        }
        return days;
    }, [data]);

    // Recent submissions
    const recentData = useMemo(() => {
        return [...data]
            .sort((a, b) => new Date(b.tgl_masuk) - new Date(a.tgl_masuk))
            .slice(0, 5);
    }, [data]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="dashboard-faskes">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">{user?.faskesName || 'Faskes'}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <DashboardCard
                    title="Total Usulan"
                    value={stats.total}
                    icon={ClipboardList}
                    color="primary"
                    subtitle="Semua usulan"
                />
                <DashboardCard
                    title="Belum Diproses"
                    value={stats.belumProses}
                    icon={Clock}
                    color="info"
                    subtitle="Menunggu verifikasi"
                />
                <DashboardCard
                    title="Lolos / Terbit"
                    value={stats.lolos}
                    icon={CheckCircle}
                    color="success"
                    subtitle={`${stats.terbit} sudah terbit BPJS`}
                />
                <DashboardCard
                    title="Pending"
                    value={stats.pending}
                    icon={AlertCircle}
                    color="warning"
                    subtitle="Perlu perbaikan"
                />
            </div>

            <div className="dashboard-content">
                {/* Chart */}
                <TrendChart
                    data={trendData}
                    title="Usulan 7 Hari Terakhir"
                />

                {/* Recent Submissions */}
                <div className="card recent-card">
                    <div className="card-header">
                        <h3 className="card-title">Usulan Terbaru</h3>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Nama Pasien</th>
                                    <th>NIK</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentData.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center text-muted">
                                            Belum ada usulan
                                        </td>
                                    </tr>
                                ) : (
                                    recentData.map(item => (
                                        <tr key={item.id}>
                                            <td>{formatDate(item.tgl_masuk)}</td>
                                            <td className="font-medium">{item.nama_pasien}</td>
                                            <td>
                                                <code style={{ fontSize: '0.7rem' }}>{item.nik_pasien}</code>
                                            </td>
                                            <td><StatusBadge statusId={item.status_id} size="sm" /></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Status Legend */}
            <div className="status-legend card">
                <h4>Keterangan Status:</h4>
                <div className="legend-items">
                    <div className="legend-item">
                        <span className="legend-dot" style={{ background: 'var(--info)' }}></span>
                        <span>Biru: Dalam Proses Verifikasi</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot" style={{ background: 'var(--warning)' }}></span>
                        <span>Kuning: Pending (Perlu Perbaikan)</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot" style={{ background: 'var(--danger)' }}></span>
                        <span>Merah: Tidak Layak</span>
                    </div>
                    <div className="legend-item">
                        <span className="legend-dot" style={{ background: 'var(--success)' }}></span>
                        <span>Hijau: Selesai (Terbit No BPJS)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
