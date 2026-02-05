import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebase';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Firebase Auth Listener
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch additional user data (role, etc) from Firestore
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email,
                            ...userDoc.data()
                        });
                    } else {
                        // Fallback if firestore doc missing (should not happen after migration)
                        console.error("User document not found in Firestore");
                        setUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (username, password) => {
        try {
            // Mapping username to email (as per migration strategy)
            const email = username.includes('@') ? username : `${username}@verifikasi-uhc.com`;

            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Fetch user data immediately for redirect logic
            const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
            let userData = {};
            if (userDoc.exists()) {
                userData = userDoc.data();
            }

            return { success: true, user: { ...userData, uid: userCredential.user.uid } };
        } catch (error) {
            console.error("Login Error:", error);
            let errorMessage = 'Gagal login. Periksa username & password.';

            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                errorMessage = 'Username atau password salah.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Format username tidak valid.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Terlalu banyak percobaan gagal. Coba lagi nanti.';
            }

            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('uhc_user'); // Cleanup old data just in case
        } catch (error) {
            console.error("Logout Error:", error);
        }
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
