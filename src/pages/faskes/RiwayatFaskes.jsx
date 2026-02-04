import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMockPendaftaran, STATUS } from '../../data/mockData';
import StatusBadge from '../../components/ui/StatusBadge';
import './RiwayatFaskes.css';

export default function RiwayatFaskes() {
    const { user } = useAuth();

    const data = useMemo(() => {
        return getMockPendaftaran()
            .filter(d => d.id_faskes_pengusul === user?.faskesId)
            .sort((a, b) => new Date(b.tgl_masuk) - new Date(a.tgl_masuk));
    }, [user?.faskesId]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getProgressWidth = (statusId) => {
        switch (statusId) {
            case 1: return 20;
            case 2: return 60;
            case 3: return 40;
            case 4: return 100;
            case 5: return 100;
            case 6: return 80;
            default: return 0;
        }
    };

    const getProgressColor = (statusId) => {
        switch (statusId) {
            case 1:
            case 2:
                return 'var(--info)';
            case 3:
            case 6:
                return 'var(--warning)';
            case 4:
                return 'var(--danger)';
            case 5:
                return 'var(--success)';
            default:
                return 'var(--secondary)';
        }
    };

    return (
        <div className="riwayat-faskes-page">
            <div className="page-header">
                <h1 className="page-title">Riwayat Usulan</h1>
                <p className="page-subtitle">Pantau status usulan pasien Anda</p>
            </div>

            <div className="riwayat-list">
                {data.length === 0 ? (
                    <div className="empty-state card">
                        <p>Belum ada riwayat usulan</p>
                    </div>
                ) : (
                    data.map(item => (
                        <div key={item.id} className="riwayat-card card">
                            <div className="riwayat-header">
                                <div className="patient-info">
                                    <h4 className="patient-name">{item.nama_pasien}</h4>
                                    <code className="patient-nik">{item.nik_pasien}</code>
                                </div>
                                <StatusBadge statusId={item.status_id} />
                            </div>

                            <div className="riwayat-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${getProgressWidth(item.status_id)}%`,
                                            background: getProgressColor(item.status_id)
                                        }}
                                    ></div>
                                </div>
                                <div className="progress-steps">
                                    <div className={`step ${item.status_id >= 1 ? 'active' : ''}`}>
                                        <span className="step-dot"></span>
                                        <span className="step-label">Diajukan</span>
                                    </div>
                                    <div className={`step ${item.status_id >= 2 ? 'active' : ''} ${item.status_id === 3 ? 'pending' : ''} ${item.status_id === 4 ? 'rejected' : ''}`}>
                                        <span className="step-dot"></span>
                                        <span className="step-label">Verif Dinkes</span>
                                    </div>
                                    <div className={`step ${item.status_id >= 5 ? 'active' : ''} ${item.status_id === 6 ? 'pending' : ''}`}>
                                        <span className="step-dot"></span>
                                        <span className="step-label">Verif BPJS</span>
                                    </div>
                                    <div className={`step ${item.status_id === 5 ? 'active' : ''}`}>
                                        <span className="step-dot"></span>
                                        <span className="step-label">Selesai</span>
                                    </div>
                                </div>
                            </div>

                            <div className="riwayat-details">
                                <div className="detail-item">
                                    <span className="detail-label">Tanggal Ajuan</span>
                                    <span className="detail-value">{formatDate(item.tgl_masuk)}</span>
                                </div>
                                {item.no_reg_dinkes && (
                                    <div className="detail-item">
                                        <span className="detail-label">No. Reg Dinkes</span>
                                        <span className="detail-value">{item.no_reg_dinkes}</span>
                                    </div>
                                )}
                                {item.no_bpjs && (
                                    <div className="detail-item success">
                                        <span className="detail-label">No. BPJS</span>
                                        <span className="detail-value">{item.no_bpjs}</span>
                                    </div>
                                )}
                                {item.catatan_verif && (
                                    <div className="detail-item warning full-width">
                                        <span className="detail-label">Catatan Verifikator</span>
                                        <span className="detail-value">{item.catatan_verif}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
