import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getIdToken } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../firebase/client';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    token: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const idToken = await getIdToken(currentUser);
                setToken(idToken);
            } else {
                setToken(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, token }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
