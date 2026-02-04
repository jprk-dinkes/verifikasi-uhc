// Mock Users Database
export const initialMockUsers = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    role: 'super_admin',
    name: 'Super Administrator'
  },
  {
    id: 'dinkes-001',
    username: 'dinkes1',
    password: 'dinkes123',
    role: 'verifikator_dinkes',
    name: 'Dr. Andi Wijaya'
  },
  {
    id: 'dinkes-002',
    username: 'dinkes2',
    password: 'dinkes123',
    role: 'verifikator_dinkes',
    name: 'Dr. Siti Rahayu'
  },
  {
    id: 'bpjs-001',
    username: 'bpjs1',
    password: 'bpjs123',
    role: 'verifikator_bpjs',
    name: 'Budi Santoso'
  },
  {
    id: 'rs-001',
    username: 'rs_hasan',
    password: 'rs123',
    role: 'faskes_rs',
    name: 'Petugas RSUD Hasan Sadikin',
    faskesId: 'faskes-rs-001',
    faskesName: 'RSUD Hasan Sadikin'
  },
  {
    id: 'rs-002',
    username: 'rs_borromeus',
    password: 'rs123',
    role: 'faskes_rs',
    name: 'Petugas RS Borromeus',
    faskesId: 'faskes-rs-002',
    faskesName: 'RS Borromeus'
  },
  {
    id: 'pkm-001',
    username: 'pkm_cijambe',
    password: 'pkm123',
    role: 'faskes_pkm',
    name: 'Petugas Puskesmas Cijambe',
    faskesId: 'faskes-pkm-001',
    faskesName: 'Puskesmas Cijambe'
  },
  {
    id: 'pkm-002',
    username: 'pkm_ciumbuleuit',
    password: 'pkm123',
    role: 'faskes_pkm',
    name: 'Petugas Puskesmas Ciumbuleuit',
    faskesId: 'faskes-pkm-002',
    faskesName: 'Puskesmas Ciumbuleuit'
  },
  {
    id: 'fo-001',
    username: 'fo123',
    password: 'fo123',
    role: 'front_office',
    name: 'Staf Front Office'
  }
];

// Compatibility wrapper for existing code that imports mockUsers directly
// In a real app, we would force everyone to use getMockUsers(), but for now we'll export a getter-like object or just valid array
// Since ES6 exports are static, we'll keep exporting the initial array but provide functions to get the "real" state
// Ideally, refactor consumers to use getMockUsers(). For minimal breakage, we initialize local storage immediately.

// Mock Faskes Database
export const mockFaskes = [
  { id: 'faskes-rs-001', name: 'RSUD Hasan Sadikin', type: 'RS', address: 'Jl. Pasteur No. 38, Bandung' },
  { id: 'faskes-rs-002', name: 'RS Borromeus', type: 'RS', address: 'Jl. Ir. H. Juanda No. 100, Bandung' },
  { id: 'faskes-rs-003', name: 'RSUP Dr. Hasan Sadikin', type: 'RS', address: 'Jl. Pasteur No. 38, Bandung' },
  { id: 'faskes-rs-004', name: 'RS Santo Yusup', type: 'RS', address: 'Jl. Cikutra No. 7, Bandung' },
  { id: 'faskes-pkm-001', name: 'Puskesmas Cijambe', type: 'PKM', address: 'Jl. Cijambe No. 25, Bandung' },
  { id: 'faskes-pkm-002', name: 'Puskesmas Ciumbuleuit', type: 'PKM', address: 'Jl. Ciumbuleuit No. 46, Bandung' },
  { id: 'faskes-pkm-003', name: 'Puskesmas Sukajadi', type: 'PKM', address: 'Jl. Sukajadi No. 112, Bandung' },
  { id: 'faskes-pkm-004', name: 'Puskesmas Tamansari', type: 'PKM', address: 'Jl. Tamansari No. 56, Bandung' }
];

// Status Constants
export const STATUS = {
  1: { label: 'Belum Proses', color: 'primary', icon: 'clock' },
  2: { label: 'Lolos Dinkes', color: 'primary', icon: 'check' },
  3: { label: 'Pending Dinkes', color: 'warning', icon: 'pause' },
  4: { label: 'Tidak Layak', color: 'danger', icon: 'x' },
  5: { label: 'Terbit No BPJS', color: 'success', icon: 'check-circle' },
  6: { label: 'Pending BPJS', color: 'warning', icon: 'pause' }
};

// Status BPJS Options
export const STATUS_BPJS_OPTIONS = [
  { value: 'BARU', label: 'Baru' },
  { value: 'PBPU_PREMI', label: 'PBPU Premi' },
  { value: 'PBI_APBN', label: 'PBI APBN' },
  { value: 'PBI_APBD', label: 'PBI APBD' },
  { value: 'PPU', label: 'PPU' },
  { value: 'PENANGGUHAN', label: 'Penangguhan' }
];

// Kelas BPJS Options (formerly Kelas Rawat)
export const KELAS_BPJS_OPTIONS = [
  { value: '-', label: '-' },
  { value: '1', label: 'Kelas 1' },
  { value: '2', label: 'Kelas 2' },
  { value: '3', label: 'Kelas 3' }
];

// Generate random NIK
const generateNIK = () => {
  let nik = '32';
  for (let i = 0; i < 14; i++) {
    nik += Math.floor(Math.random() * 10);
  }
  return nik;
};

// Generate random date in range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate No. Reg automatically
let regCounter = 1000;
export const generateNoReg = () => {
  regCounter++;
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `REG-${year}${month}-${String(regCounter).padStart(4, '0')}`;
};

// Mock Pendaftaran Data
export const generateMockPendaftaran = () => {
  // Return empty array for production - data will be added by users
  // Previously this generated 50 mock entries for demonstration
  return [];
};

// --- DATA MANAGEMENT HELPERS ---

// Pendaftaran Persistence
let mockPendaftaran = null;
export const getMockPendaftaran = () => {
  if (!mockPendaftaran) {
    const stored = localStorage.getItem('uhc_pendaftaran_v2');
    if (stored) {
      mockPendaftaran = JSON.parse(stored);
    } else {
      mockPendaftaran = generateMockPendaftaran();
      localStorage.setItem('uhc_pendaftaran_v2', JSON.stringify(mockPendaftaran));
    }
  }
  return mockPendaftaran;
};

export const savePendaftaran = (data) => {
  mockPendaftaran = data;
  localStorage.setItem('uhc_pendaftaran_v2', JSON.stringify(data));
};

export const addPendaftaran = (newEntry) => {
  const data = getMockPendaftaran();
  data.unshift(newEntry);
  savePendaftaran(data);
  return data;
};

export const updatePendaftaran = (id, updates) => {
  const data = getMockPendaftaran();
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    savePendaftaran(data);
  }
  return data;
};

// Users Persistence
let usersCache = null;

export const getMockUsers = () => {
  if (!usersCache) {
    const stored = localStorage.getItem('uhc_users_v2');
    if (stored) {
      usersCache = JSON.parse(stored);
    } else {
      usersCache = [...initialMockUsers];
      localStorage.setItem('uhc_users_v2', JSON.stringify(usersCache));
    }
  }
  return usersCache;
};

export const saveMockUsers = (users) => {
  usersCache = users;
  localStorage.setItem('uhc_users_v2', JSON.stringify(users));
  // Also update the exported constant if possible, or consumers should use getMockUsers()
};

export const addUser = (newUser) => {
  const users = getMockUsers();
  users.push(newUser);
  saveMockUsers(users);
  return users;
};

export const updateUser = (id, updates) => {
  const users = getMockUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveMockUsers(users);
  }
  return users;
};

export const deleteUser = (id) => {
  let users = getMockUsers();
  users = users.filter(u => u.id !== id);
  saveMockUsers(users);
  return users;
};

export const resetMockData = () => {
  localStorage.removeItem('uhc_pendaftaran_v2');
  localStorage.removeItem('uhc_users_v2');
  mockPendaftaran = null;
  usersCache = null;
  return {
    pendaftaran: getMockPendaftaran(),
    users: getMockUsers()
  };
};

// Backward compatibility for existing direct imports
// NOTE: This will only work for initial read. Dynamic updates won't reflect here if imported directly.
// We strongly suggest replacing mockUsers imports with getMockUsers() in components.
export const mockUsers = getMockUsers();
