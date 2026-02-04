import { useState, useEffect } from 'react';
import {
    X,
    User,
    MapPin,
    Phone,
    Building2,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Save,
    Edit3,
    File,
    Eye,
    ChevronRight,
    Search
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { STATUS_BPJS_OPTIONS, KELAS_BPJS_OPTIONS, generateNoReg } from '../../data/mockData';
import './VerificationModal.css';

export default function VerificationModal({
    data,
    onClose,
    onVerify,
    type = 'dinkes' // 'dinkes' or 'bpjs'
}) {
    const [formData, setFormData] = useState({
        nama_kk: data?.nama_kk || '',
        nik_kk: data?.nik_kk || '',
        nama_pasien: data?.nama_pasien || '',
        nik_pasien: data?.nik_pasien || '',
        alamat: data?.alamat || '',
        rt: data?.rt || '',
        rw: data?.rw || '',
        kelurahan: data?.kelurahan || '',
        kecamatan: data?.kecamatan || '',
        no_telp: data?.no_telp || '',
        tgl_masuk_rs: data?.tgl_masuk_rs || '',
        status_bpjs_awal: data?.status_bpjs_awal || 'BARU',
        kelas_bpjs: data?.kelas_bpjs || '-',
        jml_keluarga: data?.jml_keluarga || 1,
        jml_didaftarkan: data?.jml_didaftarkan || 1
    });

    const [action, setAction] = useState('');
    const [catatan, setCatatan] = useState(data?.catatan_verif || '');
    const [noBpjs, setNoBpjs] = useState(data?.no_bpjs || '');
    const [isEditing, setIsEditing] = useState(data ? data.status_id > 1 : false);
    const [loading, setLoading] = useState(false);
    const [viewDoc, setViewDoc] = useState(null);

    useEffect(() => {
        if (data) {
            setFormData({
                nama_kk: data.nama_kk || '',
                nik_kk: data.nik_kk || '',
                nama_pasien: data.nama_pasien || '',
                nik_pasien: data.nik_pasien || '',
                alamat: data.alamat || '',
                rt: data.rt || '',
                rw: data.rw || '',
                kelurahan: data.kelurahan || '',
                kecamatan: data.kecamatan || '',
                no_telp: data.no_telp || '',
                tgl_masuk_rs: data.tgl_masuk_rs || '',
                status_bpjs_awal: data.status_bpjs_awal || 'BARU',
                kelas_bpjs: data.kelas_bpjs || '-',
                jml_keluarga: data.jml_keluarga || 1,
                jml_didaftarkan: data.jml_didaftarkan || 1
            });
            setCatatan(data.catatan_verif || '');
            setNoBpjs(data.no_bpjs || '');

            setIsEditing(data.status_id > 1);
            if (data.status_id === 2 || data.status_id === 5) setAction(type === 'dinkes' ? 'lolos' : 'terbit');
            else if (data.status_id === 3 || data.status_id === 6) setAction('pending');
            else if (data.status_id === 4) setAction('tidak_layak');
        }
    }, [data, type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!action) return;

        // Confirmation (User requested "attractive", but safety first. We'll use a clean confirm if strict confirm not needed, but let's assume standard confirm is OK for logic, UI is the focus)
        if (!window.confirm('Apakah Anda yakin ingin menyimpan hasil verifikasi ini?')) return;

        setLoading(true);

        const updates = {
            ...formData,
            catatan_verif: catatan
        };

        if (type === 'dinkes') {
            if (action === 'lolos') {
                updates.status_id = 2;
                updates.no_reg_dinkes = data.no_reg_dinkes || generateNoReg();
                updates.tgl_verif_dinkes = new Date().toISOString();
            } else if (action === 'pending') {
                updates.status_id = 3;
                updates.tgl_verif_dinkes = new Date().toISOString();
            } else if (action === 'tidak_layak') {
                updates.status_id = 4;
                updates.tgl_verif_dinkes = new Date().toISOString();
            }
        } else if (type === 'bpjs') {
            if (action === 'terbit') {
                updates.status_id = 5;
                updates.no_bpjs = noBpjs;
                updates.tgl_verif_bpjs = new Date().toISOString();
            } else if (action === 'pending') {
                updates.status_id = 6;
                updates.tgl_verif_bpjs = new Date().toISOString();
            }
        }

        await onVerify(data.id, updates);
        setLoading(false);
        onClose();
    };

    const handleSaveEdit = async () => {
        if (!window.confirm('Simpan perubahan data?')) return;
        setLoading(true);
        await onVerify(data.id, {
            ...formData,
            catatan_verif: catatan,
            no_bpjs: noBpjs || data.no_bpjs
        });
        setLoading(false);
        onClose();
    };

    const documents = [
        { key: 'file_ktp', label: 'KTP', icon: FileText, color: 'blue' },
        { key: 'file_kk', label: 'Kartu Keluarga', icon: FileText, color: 'purple' },
        { key: 'file_surat_rawat', label: 'Surat Rawat', icon: FileText, color: 'green' },
        { key: 'file_pydopd', label: 'Formulir PYDOPD', icon: File, color: 'orange' },
        { key: 'file_sktm', label: 'SKTM', icon: File, color: 'red' }
    ];

    const isAlreadyVerified = data.status_id > 1;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal verification-modal ${viewDoc ? 'blur-bg' : ''}`} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title">
                        <div className="title-icon">
                            <User size={20} />
                        </div>
                        <div className="title-text">
                            <h3>Verifikasi Data Pasien</h3>
                            <span className="subtitle">ID: #{data.id} • {data.tgl_masuk}</span>
                        </div>
                    </div>
                    <div className="modal-header-right">
                        <StatusBadge statusId={data.status_id} />
                        <button className="modal-close" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="verification-content">
                        {/* Left Column - Patient & Document Data */}
                        <div className="data-section">
                            {/* Patient Identity Section */}
                            <div className="section-group animate-fade-in-up">
                                <h3 className="section-title">
                                    <User size={16} />
                                    Identitas Pasien
                                </h3>
                                <div className="data-grid">
                                    <div className="data-field">
                                        <label>Nama Kepala Keluarga</label>
                                        <input
                                            type="text"
                                            name="nama_kk"
                                            value={formData.nama_kk}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="data-field">
                                        <label>NIK Kepala Keluarga</label>
                                        <input
                                            type="text"
                                            name="nik_kk"
                                            value={formData.nik_kk}
                                            onChange={handleChange}
                                            className="form-input nik-input"
                                            maxLength={16}
                                        />
                                    </div>
                                    <div className="data-field">
                                        <label>Nama Pasien</label>
                                        <input
                                            type="text"
                                            name="nama_pasien"
                                            value={formData.nama_pasien}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="data-field">
                                        <label>NIK Pasien</label>
                                        <input
                                            type="text"
                                            name="nik_pasien"
                                            value={formData.nik_pasien}
                                            onChange={handleChange}
                                            className="form-input nik-input"
                                            maxLength={16}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="section-group animate-fade-in-up stagger-1">
                                <h3 className="section-title">
                                    <MapPin size={16} />
                                    Alamat
                                </h3>
                                <div className="data-grid">
                                    <div className="data-field full-width">
                                        <label>Alamat Lengkap</label>
                                        <input
                                            type="text"
                                            name="alamat"
                                            value={formData.alamat}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="data-field small">
                                        <label>RT</label>
                                        <input
                                            type="text"
                                            name="rt"
                                            value={formData.rt}
                                            onChange={handleChange}
                                            className="form-input"
                                            maxLength={3}
                                        />
                                    </div>
                                    <div className="data-field small">
                                        <label>RW</label>
                                        <input
                                            type="text"
                                            name="rw"
                                            value={formData.rw}
                                            onChange={handleChange}
                                            className="form-input"
                                            maxLength={3}
                                        />
                                    </div>
                                    <div className="data-field">
                                        <label>Kelurahan</label>
                                        <input
                                            type="text"
                                            name="kelurahan"
                                            value={formData.kelurahan}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="data-field">
                                        <label>Kecamatan</label>
                                        <input
                                            type="text"
                                            name="kecamatan"
                                            value={formData.kecamatan}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact & Faskes Section */}
                            <div className="section-group animate-fade-in-up stagger-2">
                                <h3 className="section-title">
                                    <Phone size={16} />
                                    Kontak & Faskes
                                </h3>
                                <div className="data-grid">
                                    <div className="data-field">
                                        <label>No. Telepon</label>
                                        <input
                                            type="text"
                                            name="no_telp"
                                            value={formData.no_telp}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="data-field">
                                        <label>Faskes Pengusul</label>
                                        <div className="readonly-value">
                                            <Building2 size={14} />
                                            {data.nama_faskes}
                                        </div>
                                    </div>
                                    {data.tgl_masuk_rs && (
                                        <div className="data-field">
                                            <label>Tanggal Masuk RS</label>
                                            <input
                                                type="date"
                                                name="tgl_masuk_rs"
                                                value={formData.tgl_masuk_rs}
                                                onChange={handleChange}
                                                className="form-input"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status & Kelas Section - Only for Dinkes */}
                            {type === 'dinkes' && (
                                <div className="section-group animate-fade-in-up stagger-3">
                                    <h3 className="section-title">
                                        <AlertCircle size={16} />
                                        Status & Kelas BPJS
                                    </h3>
                                    <div className="data-grid">
                                        <div className="data-field">
                                            <label>Status BPJS Awal</label>
                                            <select
                                                name="status_bpjs_awal"
                                                value={formData.status_bpjs_awal}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                {STATUS_BPJS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="data-field">
                                            <label>Kelas BPJS</label>
                                            <select
                                                name="kelas_bpjs"
                                                value={formData.kelas_bpjs}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                {KELAS_BPJS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="data-field">
                                            <label>Jml Anggota Keluarga</label>
                                            <input
                                                type="number"
                                                name="jml_keluarga"
                                                value={formData.jml_keluarga}
                                                onChange={handleChange}
                                                className="form-input"
                                                min={1}
                                                max={20}
                                            />
                                        </div>
                                        <div className="data-field">
                                            <label>Jml Didaftarkan</label>
                                            <input
                                                type="number"
                                                name="jml_didaftarkan"
                                                value={formData.jml_didaftarkan}
                                                onChange={handleChange}
                                                className="form-input"
                                                min={1}
                                                max={20}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Show readonly status info for BPJS */}
                            {type === 'bpjs' && (
                                <div className="section-group animate-fade-in-up stagger-3">
                                    <h3 className="section-title">
                                        <AlertCircle size={16} />
                                        Status & Kelas BPJS
                                    </h3>
                                    <div className="info-row">
                                        <span className="info-label">Status BPJS Awal:</span>
                                        <span className="info-value">{data.status_bpjs_awal || '-'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Kelas BPJS:</span>
                                        <span className="info-value">{data.kelas_bpjs || '-'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">No. Reg Dinkes:</span>
                                        <span className="info-value highlight">{data.no_reg_dinkes}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Documents & Actions */}
                        <div className="action-section">
                            {/* Documents */}
                            <div className="section-group documents-section animate-fade-in-up stagger-2">
                                <h3 className="section-title">
                                    <FileText size={16} />
                                    Dokumen Pendukung
                                </h3>
                                <div className="document-list-card">
                                    {documents.map(doc => {
                                        const hasFile = data[doc.key];
                                        return (
                                            <div
                                                key={doc.key}
                                                className={`document-card-item ${hasFile ? 'available' : 'missing'}`}
                                                onClick={() => hasFile && setViewDoc(doc)}
                                            >
                                                <div className={`doc-icon-wrapper ${doc.color}`}>
                                                    <doc.icon size={18} />
                                                </div>
                                                <div className="doc-info">
                                                    <span className="doc-name">{doc.label}</span>
                                                    <span className="doc-status">{hasFile ? 'Tersedia' : 'Tidak Ada'}</span>
                                                </div>
                                                {hasFile && (
                                                    <button className="view-btn">
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Verification Result Summary - Show if ReadOnly or Already Verified */}
                            {(props.readOnly || isAlreadyVerified) && (
                                <div className="section-group result-section animate-fade-in-up stagger-3">
                                    <h3 className="section-title">
                                        <CheckCircle size={16} />
                                        Hasil Verifikasi
                                    </h3>

                                    <div className="result-card">
                                        <div className="result-row">
                                            <span className="result-label">Status Terkini</span>
                                            <StatusBadge statusId={data.status_id} />
                                        </div>

                                        {(data.catatan_verif) && (
                                            <div className="result-row column">
                                                <span className="result-label">Catatan / Alasan</span>
                                                <div className="result-note">
                                                    {data.catatan_verif}
                                                </div>
                                            </div>
                                        )}

                                        {data.no_bpjs && (
                                            <div className="result-row">
                                                <span className="result-label">Nomor BPJS</span>
                                                <span className="result-value highlight">{data.no_bpjs}</span>
                                            </div>
                                        )}

                                        {data.no_reg_dinkes && (
                                            <div className="result-row">
                                                <span className="result-label">No. Reg Dinkes</span>
                                                <span className="result-value">{data.no_reg_dinkes}</span>
                                            </div>
                                        )}

                                        {data.verifikator_dinkes_name && (
                                            <div className="result-row">
                                                <span className="result-label">Verifikator</span>
                                                <span className="result-value">{data.verifikator_dinkes_name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Verification Actions - Only if not readOnly */}
                            {!props.readOnly && (
                                <div className="section-group actions-section animate-fade-in-up stagger-3">
                                    <h3 className="section-title">
                                        <Edit3 size={16} />
                                        Keputusan Verifikasi
                                    </h3>

                                    <div className="decision-wrapper">
                                        {type === 'dinkes' ? (
                                            <div className="decision-grid">
                                                <button
                                                    className={`decision-card lolos ${action === 'lolos' ? 'selected' : ''}`}
                                                    onClick={() => setAction('lolos')}
                                                >
                                                    <div className="icon-wrapper"><CheckCircle size={24} /></div>
                                                    <span>Lolos</span>
                                                </button>
                                                <button
                                                    className={`decision-card pending ${action === 'pending' ? 'selected' : ''}`}
                                                    onClick={() => setAction('pending')}
                                                >
                                                    <div className="icon-wrapper"><Clock size={24} /></div>
                                                    <span>Pending</span>
                                                </button>
                                                <button
                                                    className={`decision-card tidak-layak ${action === 'tidak_layak' ? 'selected' : ''}`}
                                                    onClick={() => setAction('tidak_layak')}
                                                >
                                                    <div className="icon-wrapper"><XCircle size={24} /></div>
                                                    <span>Ditolak</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="decision-grid two-cols">
                                                <button
                                                    className={`decision-card lolos ${action === 'terbit' ? 'selected' : ''}`}
                                                    onClick={() => setAction('terbit')}
                                                >
                                                    <div className="icon-wrapper"><CheckCircle size={24} /></div>
                                                    <span>Terbit</span>
                                                </button>
                                                <button
                                                    className={`decision-card pending ${action === 'pending' ? 'selected' : ''}`}
                                                    onClick={() => setAction('pending')}
                                                >
                                                    <div className="icon-wrapper"><Clock size={24} /></div>
                                                    <span>Pending</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* No BPJS Input for BPJS verifier */}
                                    {type === 'bpjs' && action === 'terbit' && (
                                        <div className="action-input-area animate-fade-in">
                                            <label className="form-label required">Nomor BPJS</label>
                                            <input
                                                type="text"
                                                className="form-input large-input"
                                                value={noBpjs}
                                                onChange={(e) => setNoBpjs(e.target.value)}
                                                placeholder="Contoh: 0001234567890"
                                                maxLength={13}
                                                autoFocus
                                            />
                                        </div>
                                    )}

                                    {/* Catatan for pending/tidak layak */}
                                    {(action === 'pending' || action === 'tidak_layak') && (
                                        <div className="action-input-area animate-fade-in">
                                            <label className="form-label required">Catatan / Alasan</label>
                                            <textarea
                                                className="form-textarea"
                                                value={catatan}
                                                onChange={(e) => setCatatan(e.target.value)}
                                                placeholder="Tuliskan alasan lengkap penundaan atau penolakan..."
                                                rows={3}
                                                autoFocus
                                            />
                                        </div>
                                    )}

                                    <div className="action-footer">
                                        <button
                                            className="btn btn-primary btn-lg w-full"
                                            onClick={handleSubmit}
                                            disabled={!action || loading || (type === 'bpjs' && action === 'terbit' && !noBpjs)}
                                        >
                                            {loading ? 'Memproses...' : 'Simpan Keputusan'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Viewer Modal */}
            {viewDoc && (
                <div className="doc-viewer-overlay" onClick={() => setViewDoc(null)}>
                    <div className="doc-viewer-content" onClick={e => e.stopPropagation()}>
                        <div className="doc-viewer-header">
                            <h3>{viewDoc.label}</h3>
                            <button className="close-viewer" onClick={() => setViewDoc(null)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="doc-viewer-body">
                            <div className="doc-placeholder">
                                <FileText size={48} />
                                <p>Preview Dokumen {viewDoc.label}</p>
                                <span className="doc-note">File demo preview</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
