# Panduan Hosting & Manajemen Akun SI Verifikasi UHC

## 1. Cara Menambahkan Akun Faskes Baru (Mode Demo)

Saat ini aplikasi masih menggunakan **Mock Data** (data simulasi). Untuk menambahkan akun baru, Anda perlu mengedit file kode secara langsung.

**Langkah-langkah:**

1. Buka file: `src/data/mockData.js`
2. Cari bagian constant `mockUsers`.
3. Tambahkan objek user baru di dalam array `mockUsers`:

```javascript
{
  id: 'user_rs_baru',        // ID unik
  username: 'rs_sehat',      // Username untuk login
  password: '123',           // Password
  name: 'Petugas RS Sehat',  // Nama petugas
  role: 'faskes_rs',         // Role: 'faskes_rs' atau 'faskes_pkm'
  faskesId: 'faskes_baru',   // Harus match dengan ID di mockFaskes
  faskesName: 'RS Sehat Keluarga'
},
```

4. Cari bagian constant `mockFaskes`.
5. Tambahkan data faskes baru:

```javascript
{
  id: 'faskes_baru',
  nama: 'RS Sehat Keluarga',
  tipe: 'RS', // 'RS' atau 'PKM'
  alamat: 'Jl. Ahmad Yani No. 99',
  kode_faskes: '1234567'
},
```

> **Catatan:** Jika backend sudah diimplementasikan (misal menggunakan Node.js & Database), penambahan user akan dilakukan melalui menu **Manajemen User** di Dashboard Admin, tanpa perlu coding.

---

## 2. Integrasi Google Drive (File Upload)

Untuk membuat fitur upload file masuk ke Google Drive sungguhan, Anda memerlukan **Backend Service**. Aplikasi React (Frontend) tidak disarankan mengakses Google Drive API secara langsung karena alasan keamanan (API Key terekspos).

**Alur Kerja:**
1. User upload file di form React.
2. File dikirim ke Backend (Node.js/Python).
3. Backend menggunakan `Service Account Google` untuk upload ke Google Drive.
4. Backend menyimpan `File ID` dari Google Drive ke Database.

**Persiapan Google Cloud:**
1. Buat Project di [Google Cloud Console](https://console.cloud.google.com).
2. Aktifkan **Google Drive API**.
3. Buat **Service Account** dan download file JSON key-nya.
4. Simpan file JSON ini di server backend Anda.

---

## 3. Panduan Hosting (Menjadikan Web Online)

Agar aplikasi bisa diakses orang lain melalui internet, Anda perlu hosting. Berikut opsi terbaik:

### Opsi A: Hosting Gratis (Cepat & Mudah) - Vercel / Netlify
Cocok untuk demo atau presentasi.

1. **Vercel**
   - Install Vercel CLI: `npm install -g vercel`
   - Login: `vercel login`
   - Deploy: Jalankan perintah `vercel` di terminal folder project.
   - Ikuti instruksi (tekan Enter untuk default).
   - Web Anda akan online di `https://verifikasi-uhc.vercel.app` (contoh).

2. **Netlify**
   - Jalankan `npm run build` di terminal.
   - Akan muncul folder `dist`.
   - Buka [Netlify Drop](https://app.netlify.com/drop).
   - Drag & Drop folder `dist` ke sana.
   - Selesai! Web langsung online.

### Opsi B: VPS / Hosting Berbayar (Untuk Production)
Cocok untuk instansi pemerintahan (menggunakan domain .go.id).

1. **Sewa VPS/Hosting** (Niagahoster, IDCloudHost, dll).
2. **Setup Domain** (misal: uhc.dinkes.namakota.go.id).
3. **Upload File Build**:
   - Jalankan `npm run build`.
   - Upload isi folder `dist` ke folder `public_html` di cPanel/File Manager hosting.
4. **Konfigurasi Server** (jika pakai VPS):
   - Install Nginx/Apache.
   - Arahkan konfigurasi server ke file `index.html`.

### Checklist Sebelum Deploy Production:
- [ ] Pastikan semua `console.log` debugging dihapus.
- [ ] Pastikan API URL mengarah ke server production, bukan localhost.
- [ ] Aktifkan HTTPS (SSL Certificate).

---
**Pengembang:** Rafied Ridwan F, A.Md.RMIK
