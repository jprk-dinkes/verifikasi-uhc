import { useState, useMemo } from 'react';
import { FileSpreadsheet, Download, Calendar } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import { getMockPendaftaran, STATUS } from '../../data/mockData';
import * as XLSX from 'xlsx';
import './LaporanDinkes.css';

export default function LaporanDinkes() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [exportType, setExportType] = useState('all');

    const allData = getMockPendaftaran();

    const filteredData = useMemo(() => {
        let result = [...allData];

        if (startDate) {
            result = result.filter(d => new Date(d.tgl_masuk) >= new Date(startDate));
        }
        if (endDate) {
            result = result.filter(d => new Date(d.tgl_masuk) <= new Date(endDate + 'T23:59:59'));
        }
        if (exportType !== 'all') {
            result = result.filter(d => d.tipe_faskes === exportType);
        }

        return result;
    }, [allData, startDate, endDate, exportType]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const columns = [
        { key: 'tgl_masuk', label: 'Tgl Masuk', render: (v) => formatDate(v) },
        { key: 'nama_pasien', label: 'Nama Pasien' },
        { key: 'nik_pasien', label: 'NIK' },
        { key: 'nama_faskes', label: 'Faskes' },
        { key: 'tipe_faskes', label: 'Tipe' },
        { key: 'status_id', label: 'Status', render: (v) => <StatusBadge statusId={v} size="sm" /> },
        { key: 'no_reg_dinkes', label: 'No. Reg', render: (v) => v || '-' },
        { key: 'no_bpjs', label: 'No. BPJS', render: (v) => v || '-' }
    ];

    const handleExport = () => {
        const exportData = filteredData.map(d => ({
            'No': filteredData.indexOf(d) + 1,
            'Tanggal Masuk': formatDate(d.tgl_masuk),
            'Tanggal Input': formatDate(d.tgl_input_petugas),
            'Nama Pasien': d.nama_pasien,
            'NIK Pasien': d.nik_pasien,
            'Nama KK': d.nama_kk,
            'NIK KK': d.nik_kk,
            'Alamat': d.alamat,
            'RT': d.rt,
            'RW': d.rw,
            'Kelurahan': d.kelurahan,
            'Kecamatan': d.kecamatan,
            'No. Telepon': d.no_telp,
            'Status BPJS Awal': d.status_bpjs_awal,
            'Kelas BPJS': d.kelas_bpjs,
            'Jml Keluarga': d.jml_keluarga,
            'Jml Didaftarkan': d.jml_didaftarkan,
            'Faskes Pengusul': d.nama_faskes,
            'Tipe Faskes': d.tipe_faskes,
            'Status': STATUS[d.status_id]?.label || d.status_id,
            'No. Reg Dinkes': d.no_reg_dinkes || '-',
            'No. BPJS': d.no_bpjs || '-',
            'Verifikator Dinkes': d.verifikator_dinkes_name || '-',
            'Tgl Verif Dinkes': formatDate(d.tgl_verif_dinkes),
            'Verifikator BPJS': d.verifikator_bpjs_name || '-',
            'Tgl Verif BPJS': formatDate(d.tgl_verif_bpjs),
            'Catatan': d.catatan_verif || '-'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data BNBA');

        // Auto-size columns
        const colWidths = Object.keys(exportData[0] || {}).map(key => ({
            wch: Math.max(key.length, 15)
        }));
        ws['!cols'] = colWidths;

        const fileName = `BNBA_UHC_${startDate || 'all'}_${endDate || 'all'}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    // Summary stats
    const stats = useMemo(() => {
        return {
            total: filteredData.length,
            lolos: filteredData.filter(d => [2, 5].includes(d.status_id)).length,
            pending: filteredData.filter(d => [3, 6].includes(d.status_id)).length,
            tidakLayak: filteredData.filter(d => d.status_id === 4).length,
            jiwa: filteredData.reduce((sum, d) => sum + (d.jml_didaftarkan || 0), 0)
        };
    }, [filteredData]);

    return (
        <div className="laporan-page">
            <div className="page-header">
                <h1 className="page-title">Laporan Data BNBA</h1>
                <p className="page-subtitle">Export data rekapitulasi ke Excel</p>
            </div>

            {/* Filter Panel */}
            <div className="filter-panel card">
                <div className="filter-row">
                    <div className="filter-group">
                        <label className="form-label">
                            <Calendar size={14} /> Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            className="form-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label className="form-label">
                            <Calendar size={14} /> Tanggal Akhir
                        </label>
                        <input
                            type="date"
                            className="form-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label className="form-label">Tipe Faskes</label>
                        <select
                            className="form-select"
                            value={exportType}
                            onChange={(e) => setExportType(e.target.value)}
                        >
                            <option value="all">Semua</option>
                            <option value="RS">Rumah Sakit</option>
                            <option value="PKM">Puskesmas</option>
                        </select>
                    </div>

                    <button className="btn btn-primary btn-lg" onClick={handleExport}>
                        <Download size={18} />
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="summary-cards">
                <div className="summary-card">
                    <FileSpreadsheet className="summary-icon" />
                    <div>
                        <span className="summary-value">{stats.total}</span>
                        <span className="summary-label">Total Data</span>
                    </div>
                </div>
                <div className="summary-card success">
                    <span className="summary-value">{stats.lolos}</span>
                    <span className="summary-label">Lolos</span>
                </div>
                <div className="summary-card warning">
                    <span className="summary-value">{stats.pending}</span>
                    <span className="summary-label">Pending</span>
                </div>
                <div className="summary-card danger">
                    <span className="summary-value">{stats.tidakLayak}</span>
                    <span className="summary-label">Tidak Layak</span>
                </div>
                <div className="summary-card info">
                    <span className="summary-value">{stats.jiwa}</span>
                    <span className="summary-label">Total Jiwa</span>
                </div>
            </div>

            {/* Preview Table */}
            <div className="preview-section">
                <h3>Preview Data ({filteredData.length} records)</h3>
                <DataTable
                    data={filteredData}
                    columns={columns}
                    pageSize={10}
                    searchable={false}
                />
            </div>
        </div>
    );
}
