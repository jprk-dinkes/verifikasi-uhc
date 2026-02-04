import { useState, useMemo } from 'react';
import { Edit3 } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import VerificationModal from '../../components/ui/VerificationModal';
import { getMockPendaftaran, updatePendaftaran, STATUS } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function RiwayatBPJS() {
    const { user } = useAuth();
    const [selectedData, setSelectedData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const data = useMemo(() => {
        return getMockPendaftaran().filter(d => [5, 6].includes(d.status_id));
    }, [refreshKey]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const columns = [
        {
            key: 'tgl_verif_bpjs',
            label: 'Tanggal Verifikasi',
            sortable: true,
            width: '140px',
            render: (value) => formatDate(value)
        },
        {
            key: 'nama_pasien',
            label: 'Nama Pasien',
            sortable: true,
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: 'nik_pasien',
            label: 'NIK',
            width: '160px',
            render: (value) => <code style={{ fontSize: '0.75rem' }}>{value}</code>
        },
        {
            key: 'no_reg_dinkes',
            label: 'No. Reg Dinkes',
            width: '150px'
        },
        {
            key: 'no_bpjs',
            label: 'No. BPJS',
            width: '150px',
            render: (value) => value ? (
                <span style={{
                    color: 'var(--success)',
                    fontWeight: 600,
                    fontFamily: 'monospace'
                }}>
                    {value}
                </span>
            ) : '-'
        },
        {
            key: 'verifikator_bpjs_name',
            label: 'Verifikator',
            render: (value) => value || '-'
        },
        {
            key: 'status_id',
            label: 'Status',
            width: '160px',
            render: (value) => <StatusBadge statusId={value} />
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: '80px',
            render: (_, row) => (
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedData(row);
                    }}
                    title="Edit data"
                >
                    <Edit3 size={14} />
                </button>
            )
        }
    ];

    const filters = [
        {
            key: 'status_id',
            label: 'Status',
            options: [
                { value: '5', label: STATUS[5].label },
                { value: '6', label: STATUS[6].label }
            ]
        }
    ];

    const handleVerify = async (id, updates) => {
        updatePendaftaran(id, {
            ...updates,
            verifikator_bpjs_id: user.id,
            verifikator_bpjs_name: user.name
        });
        setRefreshKey(k => k + 1);
    };

    return (
        <div className="riwayat-page">
            <div className="page-header">
                <h1 className="page-title">Riwayat Verifikasi BPJS</h1>
                <p className="page-subtitle">Log data yang sudah diverifikasi BPJS. Klik tombol edit untuk mengubah data.</p>
            </div>

            <DataTable
                data={data}
                columns={columns}
                filters={filters}
                searchPlaceholder="Cari nama pasien, NIK, atau No. BPJS..."
                pageSize={15}
                onRowClick={(row) => setSelectedData(row)}
                emptyMessage="Belum ada riwayat verifikasi BPJS"
            />

            {selectedData && (
                <VerificationModal
                    data={selectedData}
                    onClose={() => setSelectedData(null)}
                    onVerify={handleVerify}
                    type="bpjs"
                />
            )}
        </div>
    );
}
