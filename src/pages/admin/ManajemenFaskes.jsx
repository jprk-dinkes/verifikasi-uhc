import { mockFaskes } from '../../data/mockData';
import DataTable from '../../components/tables/DataTable';

export default function ManajemenFaskes() {
    const columns = [
        {
            key: 'id',
            label: 'ID',
            width: '140px'
        },
        {
            key: 'name',
            label: 'Nama Faskes',
            sortable: true,
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: 'type',
            label: 'Tipe',
            width: '100px',
            render: (value) => (
                <span className={`badge badge-${value === 'RS' ? 'primary' : 'success'}`}>
                    {value === 'RS' ? 'Rumah Sakit' : 'Puskesmas'}
                </span>
            )
        },
        {
            key: 'address',
            label: 'Alamat'
        }
    ];

    const filters = [
        {
            key: 'type',
            label: 'Tipe',
            options: [
                { value: 'RS', label: 'Rumah Sakit' },
                { value: 'PKM', label: 'Puskesmas' }
            ]
        }
    ];

    return (
        <div className="manajemen-faskes-page">
            <div className="page-header">
                <h1 className="page-title">Manajemen Faskes</h1>
                <p className="page-subtitle">Kelola data fasilitas kesehatan</p>
            </div>

            <DataTable
                data={mockFaskes}
                columns={columns}
                filters={filters}
                searchPlaceholder="Cari nama atau alamat faskes..."
                pageSize={10}
                emptyMessage="Tidak ada data faskes"
            />
        </div>
    );
}
