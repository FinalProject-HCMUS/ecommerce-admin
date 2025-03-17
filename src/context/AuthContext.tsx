import { createContext, useState, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (credentials: Login, navigate: ReturnType<typeof useNavigate>) => void;
    logout: (navigate: ReturnType<typeof useNavigate>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = (credentials: Login, navigate: ReturnType<typeof useNavigate>) => {
        const { username, password } = credentials;
        if (username === 'admin' && password === '123') {
            setIsAuthenticated(true);
            navigate('/products');
        } else {
            alert('Invalid username or password');
        }
    };

    const logout = (navigate: ReturnType<typeof useNavigate>) => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};