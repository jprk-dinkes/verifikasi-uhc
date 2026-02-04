// --- HELPER DATA ---
const rsList = [
  "RS ADVENT", "RS AL ISLAM BANDUNG", "KU NUR ILAHI", "RS BUNGSU", "RS EDELWEISS",
  "KU BBKPM", "RS HUMANA PRIMA", "RS IMMANUEL", "RSJP PARAMARTA", "RS KARTINI",
  "RS KEBONJATI", "RS KHUSUS GINJAL HABIBIE", "RS MELINDA 2", "RSKGM KOTA BANDUNG",
  "RS MATA CICENDO", "RS MUHAMMADIYAH", "RS SARININGSIH", "RS MITRA KASIH",
  "RS PINDAD", "RS SANTO BORROMEUS", "RS HERMINA ARCAMANIK", "RS SANTO YUSUP",
  "RS SANTOSA CENTRAL", "RS SANTOSA KOPO", "RS DUSTIRA", "RSIA AL ISLAM AWIBITUNG",
  "RSIA HARAPAN BUNDA", "RSJ PROVINSI JAWA BARAT", "RSU AVISENA", "RSUD CIBABAT",
  "RSUD OTO ISKANDAR DINATA", "RS HERMINA PASTEUR", "RS ROTINSULU", "RS SALAMUN",
  "RS SARTIKA ASIH", "RSUD WELAS ASIH", "RSUD BK", "RSUD KB", "RSUP HASAN SADIKIN"
];

const pkmList = [
  "UPTD PUSKESMAS AHMAD YANI", "UPTD PUSKESMAS ANTAPANI", "UPTD PUSKESMAS ARCAMANIK", "UPTD PUSKESMAS ASTANAANYAR",
  "UPTD PUSKESMAS BABAKAN SARI", "UPTD PUSKESMAS BABAKAN SURABAYA", "UPTD PUSKESMAS BABAKAN TAROGONG", "UPTD PUSKESMAS BABATAN",
  "UPTD PUSKESMAS BALAIKOTA", "UPTD PUSKESMAS CARINGIN", "UPTD PUSKESMAS CEMPAKA ARUM", "UPTD PUSKESMAS CIBADUYUT KIDUL",
  "UPTD PUSKESMAS CIBADUYUT WETAN", "UPTD PUSKESMAS CIBIRU", "UPTD PUSKESMAS CIBOLERANG", "UPTD PUSKESMAS CIBUNTU",
  "UPTD PUSKESMAS CIGADUNG", "UPTD PUSKESMAS CIGONDEWAH", "UPTD PUSKESMAS CIJAGRA BARU", "UPTD PUSKESMAS CIJAGRA LAMA",
  "UPTD PUSKESMAS CIJERAH", "UPTD PUSKESMAS CIKUTRA LAMA", "UPTD PUSKESMAS CILENGKRANG", "UPTD PUSKESMAS CINAMBO",
  "UPTD PUSKESMAS CIPADUNG", "UPTD PUSKESMAS CIPAKU", "UPTD PUSKESMAS CIPAMOKOLAN", "UPTD PUSKESMAS CITARIP",
  "UPTD PUSKESMAS CIUMBULEUIT", "UPTD PUSKESMAS DAGO", "UPTD PUSKESMAS DERWATI", "UPTD PUSKESMAS GARUDA",
  "UPTD PUSKESMAS GIRIMANDE", "UPTD PUSKESMAS GRIYA ANTAPANI", "UPTD PUSKESMAS GUMURUH", "UPTD PUSKESMAS IBRAHIM ADJIE",
  "UPTD PUSKESMAS JAJAWAY", "UPTD PUSKESMAS JATIHANDAP", "UPTD PUSKESMAS KARANGSETRA", "UPTD PUSKESMAS KOPO",
  "UPTD PUSKESMAS KUJANGSARI", "UPTD PUSKESMAS LEDENG", "UPTD PUSKESMAS LIO GENTENG", "UPTD PUSKESMAS MANDALA MEKAR",
  "UPTD PUSKESMAS MARGAHAYU RAYA", "UPTD PUSKESMAS MENGGER", "UPTD PUSKESMAS NEGLASARI", "UPTD PUSKESMAS PADASUKA",
  "UPTD PUSKESMAS PAGARSIH", "UPTD PUSKESMAS PAMULANG", "UPTD PUSKESMAS PANGHEGAR", "UPTD PUSKESMAS PANYILEUKAN",
  "UPTD PUSKESMAS PASAWAHAN", "UPTD PUSKESMAS PASIR JATI", "UPTD PUSKESMAS PASIRKALIKI", "UPTD PUSKESMAS PASIRLAYUNG",
  "UPTD PUSKESMAS PASIRLUYU", "UPTD PUSKESMAS PASUNDAN", "UPTD PUSKESMAS PELINDUNG HEWAN", "UPTD PUSKESMAS PUTER",
  "UPTD PUSKESMAS RAMDAN", "UPTD PUSKESMAS RIUNG BANDUNG", "UPTD PUSKESMAS RUSUNAWA", "UPTD PUSKESMAS SALAM",
  "UPTD PUSKESMAS SARIJADI", "UPTD PUSKESMAS SEKEJATI", "UPTD PUSKESMAS SEKELOA", "UPTD PUSKESMAS SINDANGJAYA",
  "UPTD PUSKESMAS SUKAGALIH", "UPTD PUSKESMAS SUKAHAJI", "UPTD PUSKESMAS SUKAJADI", "UPTD PUSKESMAS SUKAPAKIR",
  "UPTD PUSKESMAS SUKARAJA", "UPTD PUSKESMAS SUKARASA", "UPTD PUSKESMAS SUKAWARNA", "UPTD PUSKESMAS SURYALAYA",
  "UPTD PUSKESMAS TALAGABODAS", "UPTD PUSKESMAS TAMANSARI", "UPTD PUSKESMAS TAMBLONG", "UPTD PUSKESMAS UJUNG BERUNG INDAH"
];

// Generate Faskes Data
const generateFaskesData = () => {
  const faskes = [];

  // RS
  rsList.forEach((name, idx) => {
    faskes.push({
      id: `faskes-rs-${String(idx + 1).padStart(3, '0')}`,
      name: name,
      type: 'RS',
      address: 'Bandung'
    });
  });

  // PKM
  pkmList.forEach((name, idx) => {
    faskes.push({
      id: `faskes-pkm-${String(idx + 1).padStart(3, '0')}`,
      name: name,
      type: 'PKM',
      address: 'Bandung'
    });
  });

  return faskes;
};

export const mockFaskes = generateFaskesData();

// Mock Users Database
export const initialMockUsers = [
  // Super Admin
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    role: 'super_admin',
    name: 'Super Administrator'
  },

  // Verifikator Dinkes
  {
    id: 'dinkes-001',
    username: 'rizqia_wildiany',
    password: 'verif2026',
    role: 'verifikator_dinkes',
    name: 'Rizqia Wildiany'
  },
  {
    id: 'dinkes-002',
    username: 'martina_riswanty',
    password: 'verif2026',
    role: 'verifikator_dinkes',
    name: 'Martina Riswanty'
  },

  // Verifikator BPJS
  {
    id: 'bpjs-001',
    username: 'hurin_nasywa',
    password: 'bpjs12345',
    role: 'verifikator_bpjs',
    name: 'Hurin Nasywa'
  },

  // Users for Users from RS and PKM generated below...
];

// Combine basic users with generated users
const generateFaskesUsers = () => {
  const users = [];

  // Generate RS Users
  rsList.forEach((name, idx) => {
    // Username: rs_advent, rs_al_islam_bandung (lowercase, underscores)
    const username = name.toLowerCase().replace(/ /g, '_').replace(/\./g, '');
    const faskesId = `faskes-rs-${String(idx + 1).padStart(3, '0')}`;

    users.push({
      id: `user-rs-${String(idx + 1).padStart(3, '0')}`,
      username: username,
      password: 'rs12345',
      role: 'faskes_rs',
      name: `Petugas ${name}`,
      faskesId: faskesId,
      faskesName: name
    });
  });

  // Generate PKM Users
  pkmList.forEach((name, idx) => {
    // Username: pkm_ahmad_yani (remove 'UPTD PUSKESMAS ', lowercase, underscore)
    // Clean name for username
    const cleanName = name.replace('UPTD PUSKESMAS ', 'PKM ');
    const username = cleanName.toLowerCase().replace(/ /g, '_');
    const faskesId = `faskes-pkm-${String(idx + 1).padStart(3, '0')}`;

    users.push({
      id: `user-pkm-${String(idx + 1).padStart(3, '0')}`,
      username: username,
      password: 'pkm12345',
      role: 'faskes_pkm',
      name: `Petugas ${name}`,
      faskesId: faskesId,
      faskesName: name
    });
  });

  return users;
};

initialMockUsers.push(...generateFaskesUsers());

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
