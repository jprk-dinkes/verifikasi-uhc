import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchUsers, createFirebaseUser, updateFirebaseUser, deleteFirebaseUser } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../../components/tables/DataTable';
import UserFormModal from '../../components/admin/UserFormModal';
import './ManajemenUser.css';

export default function ManajemenUser() {
    const { getRoleName } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Load users on mount and refresh
    useEffect(() => {
        const loadUsers = async () => {
            setLoading(true);
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (error) {
                alert("Gagal mengambil data user");
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [refreshKey]);

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            try {
                await deleteFirebaseUser(id);
                setRefreshKey(k => k + 1);
            } catch (error) {
                alert("Gagal menghapus user: " + error.message);
            }
        }
    };

    const handleSaveUser = async (userData) => {
        try {
            if (selectedUser) {
                // Update existing
                await updateFirebaseUser(selectedUser.id, userData);
            } else {
                // Create new
                await createFirebaseUser(userData);
            }
            setIsModalOpen(false);
            setRefreshKey(k => k + 1);
        } catch (error) {
            alert("Gagal menyimpan user: " + error.message);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'super_admin': return 'danger';
            case 'verifikator_dinkes': return 'primary';
            case 'verifikator_bpjs': return 'warning';
            case 'faskes_rs': return 'success';
            case 'faskes_pkm': return 'success';
            default: return 'secondary';
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Nama',
            sortable: true,
            render: (value) => <span className="font-medium">{value}</span>
        },
        {
            key: 'username',
            label: 'Username',
            width: '140px'
        },
        {
            key: 'role',
            label: 'Role',
            width: '180px',
            render: (value) => (
                <span className={`badge badge-${getRoleBadgeColor(value)}`}>
                    {getRoleName(value)}
                </span>
            )
        },
        {
            key: 'faskesName',
            label: 'Faskes',
            render: (value) => value || '-'
        },
        {
            key: 'actions',
            label: 'Aksi',
            width: '120px',
            render: (_, row) => (
                <div className="flex gap-2">
                    <button
                        className="btn btn-icon btn-sm btn-ghost"
                        title="Edit User"
                        onClick={(e) => { e.stopPropagation(); handleEditUser(row); }}
                    >
                        <Edit2 size={16} className="text-primary" />
                    </button>
                    {row.role !== 'super_admin' && ( // Prevent deleting other admins for safety in demo
                        <button
                            className="btn btn-icon btn-sm btn-ghost"
                            title="Hapus User"
                            onClick={(e) => { e.stopPropagation(); handleDeleteUser(row.id); }}
                        >
                            <Trash2 size={16} className="text-danger" />
                        </button>
                    )}
                </div>
            )
        }
    ];

    const filters = [
        {
            key: 'role',
            label: 'Role',
            options: [
                { value: 'super_admin', label: 'Super Admin' },
                { value: 'verifikator_dinkes', label: 'Verifikator Dinkes' },
                { value: 'verifikator_bpjs', label: 'Verifikator BPJS' },
                { value: 'faskes_rs', label: 'Petugas RS' },
                { value: 'faskes_pkm', label: 'Petugas Puskesmas' }
            ]
        }
    ];

    return (
        <div className="manajemen-user-page">
            <div className="page-header flex justify-between items-center">
                <div>
                    <h1 className="page-title">Manajemen User</h1>
                    <p className="page-subtitle">Kelola pengguna sistem, tambah akun baru, atau reset password.</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddUser}>
                    <Plus size={18} />
                    Tambah User
                </button>
            </div>

            <DataTable
                data={users}
                columns={columns}
                filters={filters}
                searchPlaceholder="Cari nama atau username..."
                pageSize={10}
                emptyMessage="Tidak ada data user"
            />

            {isModalOpen && (
                <UserFormModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
}
