import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Login } from '../types/auth/Login';
import { signin } from '../apis/authApi';
import { User } from '../types/user/User';
import { getProfile } from '../apis/userApi';
import { useTranslation } from 'react-i18next';
import React from 'react';
interface AuthContextType {
    isAuthenticated: boolean;
    login: (credentials: Login, navigate: ReturnType<typeof useNavigate>) => void;
    logout: (navigate: ReturnType<typeof useNavigate>) => void;
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation('login');

    const fetchUserProfile = async () => {
        const userResponse = await getProfile();
        if (!userResponse.isSuccess) {
            toast.error(userResponse.message, { autoClose: 1000, position: 'top-center' });
            return;
        }
        setUser(userResponse.data!);
    };

    const login = async (credentials: Login, navigate: ReturnType<typeof useNavigate>) => {
        const response = await signin(credentials);
        if (!response.isSuccess) {
            toast.error(response.message, { autoClose: 1000, position: 'top-center' });
            return;
        }
        localStorage.setItem('accessToken', response.data!.accessToken);
        localStorage.setItem('refreshToken', response.data!.refreshToken);
        setIsAuthenticated(true);
        await fetchUserProfile();
        toast.success(t("loginSuccess"), {
            autoClose: 1000,
            position: 'top-right',
            onClose: () => {
                navigate('/customers');
            }
        });
    };

    const logout = (navigate: ReturnType<typeof useNavigate>) => {
        setIsAuthenticated(false);
        setUser(undefined);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };
    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');
            if (accessToken && refreshToken) {
                setIsAuthenticated(true);
                await fetchUserProfile();
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated && !user) {
            fetchUserProfile();
        }
    }, [isAuthenticated, user]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser }}>
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