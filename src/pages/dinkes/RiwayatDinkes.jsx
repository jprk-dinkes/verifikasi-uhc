import { useState, useMemo } from 'react';
import { Edit3 } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import VerificationModal from '../../components/ui/VerificationModal';
import { getMockPendaftaran, updatePendaftaran, STATUS } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function RiwayatDinkes() {
    const { user } = useAuth();
    const [selectedData, setSelectedData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const isReadOnly = user.role === 'front_office';

    const data = useMemo(() => {
        return getMockPendaftaran().filter(d => d.status_id > 1);
    }, [refreshKey]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const columns = [
        {
            key: 'tgl_verif_dinkes',
            label: 'Tanggal Verifikasi',
            sortable: true,
            width: '160px',
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
            key: 'nama_faskes',
            label: 'Faskes',
            sortable: true
        },
        {
            key: 'tipe_faskes',
            label: 'Tipe',
            width: '80px',
            render: (value) => (
                <span className={`badge badge-${value === 'RS' ? 'primary' : 'success'}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'verifikator_dinkes_name',
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
            key: 'no_reg_dinkes',
            label: 'No. Reg',
            width: '140px',
            render: (value) => value || '-'
        },
        {
            key: 'no_bpjs',
            label: 'No. BPJS',
            width: '140px',
            render: (value) => value ? <span className="font-mono font-medium text-primary">{value}</span> : '-'
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

    const displayColumns = useMemo(() => {
        if (isReadOnly) {
            return columns.filter(c => c.key !== 'actions');
        }
        return columns;
    }, [isReadOnly]);

    const filters = [
        {
            key: 'status_id',
            label: 'Status',
            options: Object.entries(STATUS)
                .filter(([key]) => parseInt(key) > 1)
                .map(([key, value]) => ({
                    value: key,
                    label: value.label
                }))
        },
        {
            key: 'tipe_faskes',
            label: 'Tipe Faskes',
            options: [
                { value: 'RS', label: 'Rumah Sakit' },
                { value: 'PKM', label: 'Puskesmas' }
            ]
        }
    ];

    const handleVerify = async (id, updates) => {
        updatePendaftaran(id, {
            ...updates,
            verifikator_dinkes_id: user.id,
            verifikator_dinkes_name: user.name
        });
        setRefreshKey(k => k + 1);
    };

    return (
        <div className="riwayat-page">
            <div className="page-header">
                <h1 className="page-title">Riwayat Verifikasi</h1>
                <p className="page-subtitle">
                    {isReadOnly
                        ? 'Log data yang sudah diverifikasi Dinkes.'
                        : 'Log data yang sudah diverifikasi Dinkes. Klik tombol edit untuk mengubah data.'}
                </p>
            </div>

            <DataTable
                data={data}
                columns={displayColumns}
                filters={filters}
                searchPlaceholder="Cari nama pasien, NIK, atau verifikator..."
                pageSize={15}
                onRowClick={(row) => setSelectedData(row)}
                emptyMessage="Belum ada riwayat verifikasi"
            />

            {selectedData && (
                <VerificationModal
                    data={selectedData}
                    onClose={() => setSelectedData(null)}
                    onVerify={handleVerify}
                    type="dinkes"
                    readOnly={isReadOnly}
                />
            )}
        </div>
    );
}
