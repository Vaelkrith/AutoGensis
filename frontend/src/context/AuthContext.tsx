import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    login: (newToken: string) => void;
    logout: () => void;
    isLoading: boolean; 
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    isLoading: true,
});

export const useAuth = () => {
    return useContext(AuthContext);
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('authToken');
            if (storedToken) {
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Error accessing localStorage:", error);
        } finally {
             setIsLoading(false); 
        }
    }, []);

    const login = (newToken: string) => {
        try {
            localStorage.setItem('authToken', newToken);
            setToken(newToken);
        } catch (error) {
             console.error("Error saving token to localStorage:", error);
        }
    };

    const logout = () => {
         try {
            localStorage.removeItem('authToken');
            setToken(null);
        } catch (error) {
             console.error("Error removing token from localStorage:", error);
        }
    };

    const isAuthenticated = !!token;

    const value = {
        token,
        isAuthenticated,
        login,
        logout,
        isLoading,
    };

    if (isLoading) {
        
        return null; 
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};