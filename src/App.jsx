import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Auth
import LoginPage from './pages/auth/LoginPage';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dinkes Pages
import DashboardDinkes from './pages/dinkes/DashboardDinkes';
import UsulanRS from './pages/dinkes/UsulanRS';
import UsulanPuskesmas from './pages/dinkes/UsulanPuskesmas';
import RiwayatDinkes from './pages/dinkes/RiwayatDinkes';
import LaporanDinkes from './pages/dinkes/LaporanDinkes';
import SettingAkun from './pages/dinkes/SettingAkun';

// Faskes Pages
import DashboardFaskes from './pages/faskes/DashboardFaskes';
import FormPendaftaran from './pages/faskes/FormPendaftaran';
import RiwayatFaskes from './pages/faskes/RiwayatFaskes';

// BPJS Pages
import DashboardBPJS from './pages/bpjs/DashboardBPJS';
import DataVerifikasiBPJS from './pages/bpjs/DataVerifikasiBPJS';
import RiwayatBPJS from './pages/bpjs/RiwayatBPJS';

// Admin Pages
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ManajemenUser from './pages/admin/ManajemenUser';
import ManajemenFaskes from './pages/admin/ManajemenFaskes';

// Front Office Pages
import DashboardFrontOffice from './pages/front-office/DashboardFrontOffice';

// Migration Tool
import FirebaseMigration from './pages/admin/FirebaseMigration';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/setup-firebase" element={<FirebaseMigration />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Dinkes Routes */}
          <Route
            path="/dinkes"
            element={<MainLayout allowedRoles={['verifikator_dinkes', 'super_admin']} />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardDinkes />} />
            <Route path="usulan-rs" element={<UsulanRS />} />
            <Route path="usulan-pkm" element={<UsulanPuskesmas />} />
            <Route path="riwayat" element={<RiwayatDinkes />} />
            <Route path="laporan" element={<LaporanDinkes />} />
            <Route path="setting" element={<SettingAkun />} />
          </Route>

          {/* Faskes Routes (RS & Puskesmas) */}
          <Route
            path="/faskes"
            element={<MainLayout allowedRoles={['faskes_rs', 'faskes_pkm']} />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardFaskes />} />
            <Route path="pendaftaran" element={<FormPendaftaran />} />
            <Route path="riwayat" element={<RiwayatFaskes />} />
            <Route path="setting" element={<SettingAkun />} />
          </Route>

          {/* BPJS Routes */}
          <Route
            path="/bpjs"
            element={<MainLayout allowedRoles={['verifikator_bpjs', 'super_admin']} />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardBPJS />} />
            <Route path="verifikasi" element={<DataVerifikasiBPJS />} />
            <Route path="riwayat" element={<RiwayatBPJS />} />
            <Route path="setting" element={<SettingAkun />} />
          </Route>

          {/* Front Office Routes */}
          <Route
            path="/front-office"
            element={<MainLayout allowedRoles={['front_office', 'super_admin']} />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardFrontOffice />} />
            <Route path="usulan-rs" element={<UsulanRS />} />
            <Route path="usulan-pkm" element={<UsulanPuskesmas />} />
            <Route path="riwayat" element={<RiwayatDinkes />} />
            <Route path="setting" element={<SettingAkun />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={<MainLayout allowedRoles={['super_admin']} />}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="users" element={<ManajemenUser />} />
            <Route path="faskes" element={<ManajemenFaskes />} />
            <Route path="setting" element={<SettingAkun />} />
          </Route>

          {/* Unauthorized */}
          <Route path="/unauthorized" element={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              color: 'var(--text-primary)'
            }}>
              <h1>403 - Akses Ditolak</h1>
              <p style={{ color: 'var(--text-muted)' }}>Anda tidak memiliki akses ke halaman ini</p>
              <a href="/login" className="btn btn-primary" style={{ marginTop: '20px' }}>
                Kembali ke Login
              </a>
            </div>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              color: 'var(--text-primary)'
            }}>
              <h1>404 - Halaman Tidak Ditemukan</h1>
              <a href="/login" className="btn btn-primary" style={{ marginTop: '20px' }}>
                Kembali ke Login
              </a>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
