import { useState, useMemo } from 'react';
import { Eye } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import VerificationModal from '../../components/ui/VerificationModal';
import { getMockPendaftaran, updatePendaftaran } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

export default function DataVerifikasiBPJS() {
    const { user } = useAuth();
    const [selectedData, setSelectedData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    // Data yang sudah lolos Dinkes (status 2)
    const data = useMemo(() => {
        return getMockPendaftaran().filter(d => d.status_id === 2);
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
            key: 'tgl_verif_dinkes',
            label: 'Tgl Verif Dinkes',
            sortable: true,
            width: '130px',
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
            key: 'no_reg_dinkes',
            label: 'No. Reg Dinkes',
            width: '120px'
        },
        {
            key: 'status_id',
            label: 'Status',
            width: '140px',
            render: (value) => <StatusBadge statusId={value} size="sm" />
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: '100px',
            render: (_, row) => (
                <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedData(row);
                    }}
                >
                    <Eye size={14} />
                    Verifikasi
                </button>
            )
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
        <div className="data-verifikasi-bpjs">
            <div className="page-header">
                <h1 className="page-title">Data Verifikasi</h1>
                <p className="page-subtitle">Data yang sudah diverifikasi Dinkes, menunggu verifikasi BPJS</p>
            </div>

            <DataTable
                data={data}
                columns={columns}
                searchPlaceholder="Cari nama pasien, NIK, atau faskes..."
                pageSize={10}
                onRowClick={(row) => setSelectedData(row)}
                emptyMessage="Tidak ada data yang perlu diverifikasi"
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
