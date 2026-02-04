import { useState } from 'react';
import { Save, Upload, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { addPendaftaran, getMockPendaftaran } from '../../data/mockData';
import { uploadToCloudinary } from '../../services/cloudinary';
import './FormPendaftaran.css';

export default function FormPendaftaran() {
    const { user } = useAuth();
    const isRS = user?.role === 'faskes_rs';

    const [formData, setFormData] = useState({
        nama_petugas: user?.name || '',
        nama_kk: '',
        nik_kk: '',
        nama_pasien: '',
        nik_pasien: '',
        alamat: '',
        rt: '',
        rw: '',
        kelurahan: '',
        kecamatan: '',
        no_telp: '',
        tgl_masuk_rs: '',
        catatan: '',
        file_ktp: null,
        file_kk: null,
        file_surat_rawat: null,
        file_pydopd: null,
        file_sktm: null
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateNIK = (nik) => {
        if (!nik) return 'NIK wajib diisi';
        if (!/^\d+$/.test(nik)) return 'NIK harus berupa angka';
        if (nik.length !== 16) return 'NIK harus tepat 16 digit';
        return null;
    };

    const checkDuplicateNIK = (nik) => {
        const existingData = getMockPendaftaran();
        const activeStatuses = [1, 2, 3, 6];
        return existingData.some(d =>
            d.nik_pasien === nik && activeStatuses.includes(d.status_id)
        );
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nama_kk) newErrors.nama_kk = 'Nama Kepala Keluarga wajib diisi';
        if (!formData.nama_pasien) newErrors.nama_pasien = 'Nama Pasien wajib diisi';
        if (!formData.alamat) newErrors.alamat = 'Alamat wajib diisi';
        if (!formData.kelurahan) newErrors.kelurahan = 'Kelurahan wajib diisi';
        if (!formData.kecamatan) newErrors.kecamatan = 'Kecamatan wajib diisi';

        const nikKKError = validateNIK(formData.nik_kk);
        if (nikKKError) newErrors.nik_kk = nikKKError;

        const nikPasienError = validateNIK(formData.nik_pasien);
        if (nikPasienError) newErrors.nik_pasien = nikPasienError;

        if (!nikPasienError && checkDuplicateNIK(formData.nik_pasien)) {
            newErrors.nik_pasien = 'NIK sudah terdaftar dan sedang dalam proses';
        }

        if (isRS && !formData.tgl_masuk_rs) {
            newErrors.tgl_masuk_rs = 'Tanggal masuk RS wajib diisi';
        }

        if (!formData.file_ktp) newErrors.file_ktp = 'KTP wajib diunggah';
        if (!formData.file_kk) newErrors.file_kk = 'Kartu Keluarga wajib diunggah';
        if (!formData.file_surat_rawat) newErrors.file_surat_rawat = 'Surat Rawat wajib diunggah';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            // Upload files to Cloudinary
            const uploadPromises = [
                formData.file_ktp ? uploadToCloudinary(formData.file_ktp) : Promise.resolve(null),
                formData.file_kk ? uploadToCloudinary(formData.file_kk) : Promise.resolve(null),
                formData.file_surat_rawat ? uploadToCloudinary(formData.file_surat_rawat) : Promise.resolve(null),
                formData.file_pydopd ? uploadToCloudinary(formData.file_pydopd) : Promise.resolve(null),
                formData.file_sktm ? uploadToCloudinary(formData.file_sktm) : Promise.resolve(null)
            ];

            const [
                url_ktp,
                url_kk,
                url_surat_rawat,
                url_pydopd,
                url_sktm
            ] = await Promise.all(uploadPromises);

            const newEntry = {
                id: `pend-${Date.now()}`,
                tgl_masuk: new Date().toISOString(),
                tgl_input_petugas: new Date().toISOString(),
                tgl_verif_dinkes: null,
                tgl_verif_bpjs: null,

                nama_pasien: formData.nama_pasien,
                nik_pasien: formData.nik_pasien,
                nama_kk: formData.nama_kk,
                nik_kk: formData.nik_kk,
                alamat: formData.alamat,
                rt: formData.rt,
                rw: formData.rw,
                kelurahan: formData.kelurahan,
                kecamatan: formData.kecamatan,
                no_telp: formData.no_telp,

                tgl_masuk_rs: formData.tgl_masuk_rs || null,
                status_bpjs_awal: null,
                kelas_bpjs: null,
                jml_keluarga: null,
                jml_didaftarkan: null,

                // Use the returned Cloudinary URLs
                file_ktp: url_ktp || null,
                file_kk: url_kk || null,
                file_surat_rawat: url_surat_rawat || null,
                file_pydopd: url_pydopd || null,
                file_sktm: url_sktm || null,

                status_id: 1,
                no_reg_dinkes: null,
                no_bpjs: null,
                catatan_verif: formData.catatan || null,

                id_faskes_pengusul: user?.faskesId,
                nama_faskes: user?.faskesName,
                tipe_faskes: isRS ? 'RS' : 'PKM',
                verifikator_dinkes_id: null,
                verifikator_dinkes_name: null,
                verifikator_bpjs_id: null,
                verifikator_bpjs_name: null
            };

            addPendaftaran(newEntry);
            setLoading(false);
            setSubmitted(true);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Gagal mengupload dokumen. Pastikan koneksi internet lancar dan konfigurasi Cloudinary benar.");
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nama_petugas: user?.name || '',
            nama_kk: '',
            nik_kk: '',
            nama_pasien: '',
            nik_pasien: '',
            alamat: '',
            rt: '',
            rw: '',
            kelurahan: '',
            kecamatan: '',
            no_telp: '',
            tgl_masuk_rs: '',
            catatan: '',
            file_ktp: null,
            file_kk: null,
            file_surat_rawat: null,
            file_pydopd: null,
            file_sktm: null
        });
        setErrors({});
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <div className="form-page">
                <div className="success-message card animate-scale-in">
                    <div className="success-icon">
                        <Check size={48} />
                    </div>
                    <h2>Data Berhasil Disimpan!</h2>
                    <p>Usulan pendaftaran pasien telah masuk ke antrian verifikasi Dinkes.</p>
                    <button className="btn btn-primary btn-lg" onClick={resetForm}>
                        Tambah Data Baru
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            <div className="page-header">
                <h1 className="page-title">Form Pendaftaran</h1>
                <p className="page-subtitle">
                    Input data pasien baru untuk usulan UHC - {user?.faskesName}
                </p>
            </div>

            <form className="registration-form card animate-fade-in-up" onSubmit={handleSubmit}>
                {/* Petugas Info */}
                <div className="form-section">
                    <h3 className="section-title">Informasi Petugas</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Nama Petugas</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.nama_petugas}
                                disabled
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Faskes</label>
                            <input
                                type="text"
                                className="form-input"
                                value={user?.faskesName || ''}
                                disabled
                            />
                        </div>
                    </div>
                </div>

                {/* Identitas Kepala Keluarga */}
                <div className="form-section">
                    <h3 className="section-title">Identitas Kepala Keluarga</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required">Nama Kepala Keluarga</label>
                            <input
                                type="text"
                                name="nama_kk"
                                className={`form-input ${errors.nama_kk ? 'error' : ''}`}
                                value={formData.nama_kk}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.nama_kk && <span className="form-error">{errors.nama_kk}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label required">NIK Kepala Keluarga</label>
                            <input
                                type="text"
                                name="nik_kk"
                                className={`form-input ${errors.nik_kk ? 'error' : ''}`}
                                value={formData.nik_kk}
                                onChange={handleChange}
                                placeholder="16 digit angka"
                                maxLength={16}
                            />
                            {errors.nik_kk && <span className="form-error">{errors.nik_kk}</span>}
                        </div>
                    </div>
                </div>

                {/* Identitas Pasien */}
                <div className="form-section">
                    <h3 className="section-title">Identitas Pasien</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label required">Nama Pasien</label>
                            <input
                                type="text"
                                name="nama_pasien"
                                className={`form-input ${errors.nama_pasien ? 'error' : ''}`}
                                value={formData.nama_pasien}
                                onChange={handleChange}
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.nama_pasien && <span className="form-error">{errors.nama_pasien}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label required">NIK Pasien</label>
                            <input
                                type="text"
                                name="nik_pasien"
                                className={`form-input ${errors.nik_pasien ? 'error' : ''}`}
                                value={formData.nik_pasien}
                                onChange={handleChange}
                                placeholder="16 digit angka"
                                maxLength={16}
                            />
                            {errors.nik_pasien && <span className="form-error">{errors.nik_pasien}</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">No. Telepon</label>
                        <input
                            type="text"
                            name="no_telp"
                            className="form-input"
                            value={formData.no_telp}
                            onChange={handleChange}
                            placeholder="Masukkan nomor telepon pasien"
                        />
                    </div>
                </div>

                {/* Alamat */}
                <div className="form-section">
                    <h3 className="section-title">Alamat</h3>
                    <div className="form-group">
                        <label className="form-label required">Alamat Lengkap</label>
                        <input
                            type="text"
                            name="alamat"
                            className={`form-input ${errors.alamat ? 'error' : ''}`}
                            value={formData.alamat}
                            onChange={handleChange}
                            placeholder="Jalan, Nomor, Gang, dll"
                        />
                        {errors.alamat && <span className="form-error">{errors.alamat}</span>}
                    </div>
                    <div className="form-row four-cols">
                        <div className="form-group">
                            <label className="form-label">RT</label>
                            <input
                                type="text"
                                name="rt"
                                className="form-input"
                                value={formData.rt}
                                onChange={handleChange}
                                placeholder="01"
                                maxLength={3}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">RW</label>
                            <input
                                type="text"
                                name="rw"
                                className="form-input"
                                value={formData.rw}
                                onChange={handleChange}
                                placeholder="01"
                                maxLength={3}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Kelurahan</label>
                            <input
                                type="text"
                                name="kelurahan"
                                className={`form-input ${errors.kelurahan ? 'error' : ''}`}
                                value={formData.kelurahan}
                                onChange={handleChange}
                                placeholder="Kelurahan"
                            />
                            {errors.kelurahan && <span className="form-error">{errors.kelurahan}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Kecamatan</label>
                            <input
                                type="text"
                                name="kecamatan"
                                className={`form-input ${errors.kecamatan ? 'error' : ''}`}
                                value={formData.kecamatan}
                                onChange={handleChange}
                                placeholder="Kecamatan"
                            />
                            {errors.kecamatan && <span className="form-error">{errors.kecamatan}</span>}
                        </div>
                    </div>
                </div>

                {/* Tanggal Masuk RS - Only for RS */}
                {isRS && (
                    <div className="form-section">
                        <h3 className="section-title">Informasi Rawat Inap</h3>
                        <div className="form-group" style={{ maxWidth: '300px' }}>
                            <label className="form-label required">Tanggal Masuk RS</label>
                            <input
                                type="date"
                                name="tgl_masuk_rs"
                                className={`form-input ${errors.tgl_masuk_rs ? 'error' : ''}`}
                                value={formData.tgl_masuk_rs}
                                onChange={handleChange}
                            />
                            {errors.tgl_masuk_rs && <span className="form-error">{errors.tgl_masuk_rs}</span>}
                        </div>
                    </div>
                )}

                {/* Upload Files */}
                <div className="form-section">
                    <h3 className="section-title">Upload Dokumen</h3>
                    <div className="upload-grid">
                        <div className="form-group">
                            <label className="form-label required">KTP</label>
                            <div className={`file-upload ${errors.file_ktp ? 'error' : ''} ${formData.file_ktp ? 'has-file' : ''}`}>
                                <input
                                    type="file"
                                    name="file_ktp"
                                    accept="image/*,.pdf"
                                    onChange={handleChange}
                                />
                                <Upload size={20} />
                                <span className="file-name-display">{formData.file_ktp?.name || 'Pilih file KTP'}</span>
                            </div>
                            {errors.file_ktp && <span className="form-error">{errors.file_ktp}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Kartu Keluarga</label>
                            <div className={`file-upload ${errors.file_kk ? 'error' : ''} ${formData.file_kk ? 'has-file' : ''}`}>
                                <input
                                    type="file"
                                    name="file_kk"
                                    accept="image/*,.pdf"
                                    onChange={handleChange}
                                />
                                <Upload size={20} />
                                <span className="file-name-display">{formData.file_kk?.name || 'Pilih file KK'}</span>
                            </div>
                            {errors.file_kk && <span className="form-error">{errors.file_kk}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Surat Rawat / Hasil Pemeriksaan</label>
                            <div className={`file-upload ${errors.file_surat_rawat ? 'error' : ''} ${formData.file_surat_rawat ? 'has-file' : ''}`}>
                                <input
                                    type="file"
                                    name="file_surat_rawat"
                                    accept="image/*,.pdf"
                                    onChange={handleChange}
                                />
                                <Upload size={20} />
                                <span className="file-name-display">{formData.file_surat_rawat?.name || 'Pilih file'}</span>
                            </div>
                            {errors.file_surat_rawat && <span className="form-error">{errors.file_surat_rawat}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Formulir PYDOPD (Opsional)</label>
                            <div className={`file-upload ${formData.file_pydopd ? 'has-file' : ''}`}>
                                <input
                                    type="file"
                                    name="file_pydopd"
                                    accept="image/*,.pdf"
                                    onChange={handleChange}
                                />
                                <Upload size={20} />
                                <span className="file-name-display">{formData.file_pydopd?.name || 'Pilih file (opsional)'}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">SKTM (Opsional)</label>
                            <div className={`file-upload ${formData.file_sktm ? 'has-file' : ''}`}>
                                <input
                                    type="file"
                                    name="file_sktm"
                                    accept="image/*,.pdf"
                                    onChange={handleChange}
                                />
                                <Upload size={20} />
                                <span className="file-name-display">{formData.file_sktm?.name || 'Pilih file (opsional)'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catatan */}
                <div className="form-section">
                    <h3 className="section-title">Catatan (Opsional)</h3>
                    <div className="form-group">
                        <textarea
                            name="catatan"
                            className="form-textarea"
                            value={formData.catatan}
                            onChange={handleChange}
                            placeholder="Tambahkan catatan jika diperlukan..."
                            rows={3}
                        />
                    </div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                        Reset Form
                    </button>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? 'Menyimpan...' : (
                            <>
                                <Save size={18} />
                                Simpan Data
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
