import { useMemo, useState } from 'react';
import {
    Users,
    Building2,
    Building,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    TrendingUp,
    UserCheck,
    ArrowRightLeft,
    Calendar,
    PieChart,
    BarChart3
} from 'lucide-react';
import DashboardCard from '../../components/ui/DashboardCard';
import { TrendChart, BarChartComponent, PieChartComponent } from '../../components/charts/Charts';
import { getMockPendaftaran, STATUS } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardDinkes.css';

export default function DashboardDinkes() {
    const { user } = useAuth();
    const [dateFilter, setDateFilter] = useState('all');

    const data = useMemo(() => {
        let result = getMockPendaftaran();

        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case '7days':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case '30days':
                    filterDate.setDate(now.getDate() - 30);
                    break;
                default:
                    break;
            }

            result = result.filter(d => new Date(d.tgl_masuk) >= filterDate);
        }

        return result;
    }, [dateFilter]);

    const stats = useMemo(() => {
        const rsData = data.filter(d => d.tipe_faskes === 'RS');
        const pkmData = data.filter(d => d.tipe_faskes === 'PKM');

        const belumProses = data.filter(d => d.status_id === 1).length;
        const lolosDinkes = data.filter(d => d.status_id === 2).length;
        const pendingDinkes = data.filter(d => d.status_id === 3).length;
        const tidakLayak = data.filter(d => d.status_id === 4).length;
        const terbit = data.filter(d => d.status_id === 5).length;
        const pendingBpjs = data.filter(d => d.status_id === 6).length;

        // PBI Non-Aktif yang diusulkan UHC
        const pbiNonAktif = data.filter(d =>
            ['PBI_APBN', 'PBI_APBD'].includes(d.status_bpjs_awal)
        ).length;

        // PBPU Premi yang dialihkan
        const pbpuDialihkan = data.filter(d =>
            d.status_bpjs_awal === 'PBPU_PREMI'
        ).length;

        // Total jiwa yang di-ACC
        const jiwaAcc = data
            .filter(d => [2, 5].includes(d.status_id))
            .reduce((sum, d) => sum + (d.jml_didaftarkan || 0), 0);

        return {
            total: data.length,
            rs: rsData.length,
            pkm: pkmData.length,
            belumProses,
            lolosDinkes,
            pendingDinkes,
            tidakLayak,
            terbit,
            pendingBpjs,
            pbiNonAktif,
            pbpuDialihkan,
            jiwaAcc
        };
    }, [data]);

    // Trend data (last 7 days)
    const trendData = useMemo(() => {
        const allData = getMockPendaftaran();
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = allData.filter(d =>
                d.tgl_masuk.split('T')[0] === dateStr
            ).length;
            days.push({
                name: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                value: count
            });
        }
        return days;
    }, []);

    // Pie chart data for status distribution
    const statusPieData = useMemo(() => [
        { name: 'Belum Proses', value: stats.belumProses, color: '#F97316' },
        { name: 'Lolos Dinkes', value: stats.lolosDinkes, color: '#10B981' },
        { name: 'Pending Dinkes', value: stats.pendingDinkes, color: '#F59E0B' },
        { name: 'Tidak Layak', value: stats.tidakLayak, color: '#EF4444' },
        { name: 'Terbit BPJS', value: stats.terbit, color: '#3B82F6' },
    ], [stats]);

    // Verifikator workload
    const workloadData = useMemo(() => {
        const verifikators = {};
        data.filter(d => d.verifikator_dinkes_name).forEach(d => {
            const name = d.verifikator_dinkes_name;
            if (!verifikators[name]) {
                verifikators[name] = { rs: 0, pkm: 0 };
            }
            if (d.tipe_faskes === 'RS') {
                verifikators[name].rs++;
            } else {
                verifikators[name].pkm++;
            }
        });
        return Object.entries(verifikators).map(([name, counts]) => ({
            name: name.split(' ').slice(-1)[0],
            RS: counts.rs,
            PKM: counts.pkm
        }));
    }, [data]);

    // Top Faskes
    const topFaskes = useMemo(() => {
        const faskesStats = {};
        data.forEach(d => {
            const name = d.nama_faskes;
            if (!faskesStats[name]) {
                faskesStats[name] = {
                    name,
                    total: 0,
                    lolos: 0,
                    pending: 0,
                    tidakLayak: 0,
                    type: d.tipe_faskes
                };
            }
            faskesStats[name].total++;
            if ([2, 5].includes(d.status_id)) faskesStats[name].lolos++;
            if ([3, 6].includes(d.status_id)) faskesStats[name].pending++;
            if (d.status_id === 4) faskesStats[name].tidakLayak++;
        });
        return Object.values(faskesStats)
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [data]);

    return (
        <div className="dashboard-dinkes">
            <div className="page-header">
                <div className="header-content">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle">Selamat datang, {user?.name}</p>
                    </div>
                    <div className="date-filter">
                        <Calendar size={16} />
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="form-select"
                        >
                            <option value="all">Semua Waktu</option>
                            <option value="today">Hari Ini</option>
                            <option value="7days">7 Hari Terakhir</option>
                            <option value="30days">30 Hari Terakhir</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Executive Stats */}
            <div className="executive-stats">
                <DashboardCard
                    title="Total Usulan"
                    value={stats.total}
                    icon={Users}
                    color="primary"
                    trend="up"
                    trendValue="+12%"
                    subtitle="Semua faskes"
                    className="card-accent"
                />
                <DashboardCard
                    title="Usulan RS"
                    value={stats.rs}
                    icon={Building2}
                    color="info"
                    subtitle="Rumah Sakit"
                />
                <DashboardCard
                    title="Usulan Puskesmas"
                    value={stats.pkm}
                    icon={Building}
                    color="success"
                    subtitle="Puskesmas"
                />
                <DashboardCard
                    title="Jiwa di-ACC"
                    value={stats.jiwaAcc}
                    icon={UserCheck}
                    color="success"
                    trend="up"
                    trendValue="+8%"
                    subtitle="Total jiwa terverifikasi"
                />
            </div>

            {/* Quick Status Overview */}
            <div className="status-overview">
                <div className="status-item primary">
                    <Clock size={20} />
                    <div className="status-info">
                        <span className="status-value">{stats.belumProses}</span>
                        <span className="status-label">Belum Diproses</span>
                    </div>
                </div>
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
                        <span className="status-label">Terbit BPJS</span>
                    </div>
                </div>
            </div>

            {/* Special Stats Row */}
            <div className="special-stats">
                <div className="card special-card animate-fade-in-up stagger-1">
                    <div className="special-icon primary">
                        <TrendingUp size={24} />
                    </div>
                    <div className="special-content">
                        <span className="special-value">{stats.pbiNonAktif}</span>
                        <span className="special-title">PBI APBN/APBD Non-Aktif → UHC</span>
                        <span className="special-desc">Peserta PBI yang diusulkan UHC</span>
                    </div>
                </div>
                <div className="card special-card animate-fade-in-up stagger-2">
                    <div className="special-icon info">
                        <ArrowRightLeft size={24} />
                    </div>
                    <div className="special-content">
                        <span className="special-value">{stats.pbpuDialihkan}</span>
                        <span className="special-title">PBPU Premi → UHC</span>
                        <span className="special-desc">Peserta mandiri dialihkan</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <div className="chart-main">
                    <TrendChart
                        data={trendData}
                        title="Tren Usulan 7 Hari Terakhir"
                    />
                </div>
                <div className="chart-side">
                    <PieChartComponent
                        data={statusPieData}
                        title="Distribusi Status"
                    />
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="bottom-grid">
                {/* Workload Chart */}
                <div className="chart-workload">
                    <BarChartComponent
                        data={workloadData}
                        title="Beban Kerja Verifikator"
                        bars={[
                            { dataKey: 'RS', color: '#F97316', name: 'Rumah Sakit' },
                            { dataKey: 'PKM', color: '#10B981', name: 'Puskesmas' }
                        ]}
                    />
                </div>

                {/* Top Faskes Table */}
                <div className="card top-faskes-card animate-fade-in-up stagger-3">
                    <div className="card-header">
                        <h3 className="card-title">
                            <BarChart3 size={18} />
                            Top Faskes Pengusul
                        </h3>
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama Faskes</th>
                                    <th>Tipe</th>
                                    <th>Total</th>
                                    <th>Lolos</th>
                                    <th>Pending</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topFaskes.map((faskes, index) => (
                                    <tr key={faskes.name}>
                                        <td>
                                            <span className={`rank-badge rank-${index + 1}`}>
                                                {index + 1}
                                            </span>
                                        </td>
                                        <td className="font-medium">{faskes.name}</td>
                                        <td>
                                            <span className={`badge badge-${faskes.type === 'RS' ? 'primary' : 'success'}`}>
                                                {faskes.type}
                                            </span>
                                        </td>
                                        <td><strong>{faskes.total}</strong></td>
                                        <td style={{ color: 'var(--success)' }}>{faskes.lolos}</td>
                                        <td style={{ color: 'var(--warning)' }}>{faskes.pending}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
