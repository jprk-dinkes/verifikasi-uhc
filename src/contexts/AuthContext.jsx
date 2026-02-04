import { createContext, useContext, useState, useEffect } from 'react';
import { getMockUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored session
        const stored = localStorage.getItem('uhc_user');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = (username, password) => {
        const users = getMockUsers();
        const foundUser = users.find(
            u => u.username === username && u.password === password
        );

        if (foundUser) {
            const userData = { ...foundUser };
            delete userData.password;
            setUser(userData);
            localStorage.setItem('uhc_user', JSON.stringify(userData));
            return { success: true, user: userData };
        }

        return { success: false, error: 'Username atau password salah' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('uhc_user');
    };

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('uhc_user', JSON.stringify(updatedUser));
    };

    const getRoleName = (role) => {
        const roleNames = {
            super_admin: 'Super Admin',
            verifikator_dinkes: 'Verifikator Dinkes',
            verifikator_bpjs: 'Verifikator BPJS',
            faskes_rs: 'Petugas Rumah Sakit',
            faskes_pkm: 'Petugas Puskesmas',
            front_office: 'Front Office'
        };
        return roleNames[role] || role;
    };

    const getDefaultRoute = (role) => {
        switch (role) {
            case 'super_admin':
                return '/admin/dashboard';
            case 'verifikator_dinkes':
                return '/dinkes/dashboard';
            case 'verifikator_bpjs':
                return '/bpjs/dashboard';
            case 'faskes_rs':
            case 'faskes_pkm':
                return '/faskes/dashboard';
            case 'front_office':
                return '/front-office/dashboard';
            default:
                return '/login';
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            updateProfile,
            getRoleName,
            getDefaultRoute,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
