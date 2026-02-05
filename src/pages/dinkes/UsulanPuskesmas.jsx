import { useState, useMemo, useEffect } from 'react';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';
import VerificationModal from '../../components/ui/VerificationModal';
import { STATUS, generateNoReg } from '../../data/mockData';
import { fetchPendaftaran, updatePendaftaranStatus } from '../../services/pendaftaranService';
import { useAuth } from '../../contexts/AuthContext';

export default function UsulanPuskesmas() {
    const { user } = useAuth();
    const [selectedData, setSelectedData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);
    const [bulkLoading, setBulkLoading] = useState(false);
    const [allData, setAllData] = useState([]);
    const [loading, setLoading] = useState(true);

    const isReadOnly = user.role === 'front_office';

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const fetched = await fetchPendaftaran();
                setAllData(fetched);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [refreshKey]);

    const data = useMemo(() => {
        return allData.filter(d =>
            d.tipe_faskes === 'PKM' && d.status_id === 1
        );
    }, [allData]);

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
            key: 'tgl_masuk',
            label: 'Tanggal Masuk',
            sortable: true,
            width: '120px',
            render: (value) => formatDate(value)
        },
        {
            key: 'tgl_input_petugas',
            label: 'Tanggal Input',
            sortable: true,
            width: '120px',
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
            label: 'Puskesmas',
            sortable: true
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
            options: Object.entries(STATUS).map(([key, value]) => ({
                value: key,
                label: value.label
            }))
        }
    ];

    const handleVerify = async (id, updates) => {
        try {
            await updatePendaftaranStatus(id, {
                ...updates,
                verifikator_dinkes_id: user.uid || user.id,
                verifikator_dinkes_name: user.name
            });
            setRefreshKey(k => k + 1);
        } catch (error) {
            alert("Gagal memverifikasi: " + error.message);
        }
    };

    const handleBulkAction = async (actionType) => {
        if (!window.confirm(`Apakah Anda yakin ingin melakukan aksi "${actionType.toUpperCase()}" untuk ${selectedIds.length} data terpilih?`)) {
            return;
        }

        setBulkLoading(true);

        const now = new Date().toISOString();

        for (const id of selectedIds) {
            let updates = {
                verifikator_dinkes_id: user.id,
                verifikator_dinkes_name: user.name,
                tgl_verif_dinkes: now
            };

            if (actionType === 'lolos') {
                updates.status_id = 2;
                updates.no_reg_dinkes = generateNoReg();
            } else if (actionType === 'pending') {
                updates.status_id = 3;
                updates.catatan_verif = 'Bulk action: Pending';
            } else if (actionType === 'tolak') {
                updates.status_id = 4;
                updates.catatan_verif = 'Bulk action: Ditolak';
            }

            try {
                await updatePendaftaranStatus(id, updates);
            } catch (error) {
                console.error(`Failed to update ${id}`, error);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 800));

        setRefreshKey(k => k + 1);
        setSelectedIds([]);
        setBulkLoading(false);
    };

    const BulkActions = () => (
        <div className="flex gap-2">
            <button
                className="btn btn-sm btn-success"
                onClick={() => handleBulkAction('lolos')}
                disabled={bulkLoading}
            >
                <CheckCircle size={14} />
                Lolos ({selectedIds.length})
            </button>
            <button
                className="btn btn-sm btn-warning"
                onClick={() => handleBulkAction('pending')}
                disabled={bulkLoading}
            >
                <Clock size={14} />
                Pending ({selectedIds.length})
            </button>
            <button
                className="btn btn-sm btn-danger"
                onClick={() => handleBulkAction('tolak')}
                disabled={bulkLoading}
            >
                <XCircle size={14} />
                Tolak ({selectedIds.length})
            </button>
        </div>
    );

    return (
        <div className="usulan-page">
            <div className="page-header">
                <h1 className="page-title">Usulan Data Puskesmas</h1>
                <p className="page-subtitle">Daftar usulan pasien dari Puskesmas yang belum diverifikasi</p>
            </div>

            <DataTable
                data={data}
                columns={displayColumns}
                filters={filters}
                searchPlaceholder="Cari nama pasien, NIK, atau nama Puskesmas..."
                pageSize={10}
                onRowClick={(row) => isReadOnly ? null : setSelectedData(row)}
                emptyMessage="Tidak ada usulan data Puskesmas yang perlu diverifikasi"
                selection={!isReadOnly}
                onSelectionChange={setSelectedIds}
                actions={!isReadOnly && selectedIds.length > 0 ? <BulkActions /> : null}
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
