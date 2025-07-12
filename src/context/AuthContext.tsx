import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Login } from '../types/auth/Login';
import { signin, refreshToken } from '../apis/authApi';
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
    loading: boolean;
    refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('login');

    const fetchUserProfile = async () => {
        try {
            const userResponse = await getProfile();
            if (!userResponse.isSuccess) {
                console.error('Failed to fetch user profile:', userResponse.message);
                return false;
            }
            setUser(userResponse.data!);
            return true;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return false;
        }
    };

    const refreshAccessToken = async (): Promise<boolean> => {
        try {
            const storedRefreshToken = localStorage.getItem('refreshToken');
            if (!storedRefreshToken) {
                return false;
            }

            const response = await refreshToken(storedRefreshToken);
            if (response.isSuccess && response.data) {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    };

    const login = async (credentials: Login, navigate: ReturnType<typeof useNavigate>) => {
        try {
            const response = await signin(credentials);
            if (!response.isSuccess) {
                toast.error(response.message, { autoClose: 1000, position: 'top-center' });
                return;
            }

            localStorage.setItem('accessToken', response.data!.accessToken);
            localStorage.setItem('refreshToken', response.data!.refreshToken);
            setIsAuthenticated(true);

            const profileFetched = await fetchUserProfile();
            if (profileFetched) {
                toast.success(t("loginSuccess"), {
                    autoClose: 1000,
                    position: 'top-right',
                    onClose: () => {
                        navigate('/customers');
                    }
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Login failed. Please try again.', { autoClose: 1000, position: 'top-center' });
        }
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
            const storedRefreshToken = localStorage.getItem('refreshToken');

            if (accessToken) {
                setIsAuthenticated(true);
                const profileFetched = await fetchUserProfile();

                if (!profileFetched && storedRefreshToken) {
                    // Try to refresh token if profile fetch failed
                    const refreshSuccess = await refreshAccessToken();
                    if (refreshSuccess) {
                        await fetchUserProfile();
                    } else {
                        // Refresh failed, clear tokens
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        setIsAuthenticated(false);
                    }
                }
            } else if (storedRefreshToken) {
                // Try to get new access token with refresh token
                const refreshSuccess = await refreshAccessToken();
                if (refreshSuccess) {
                    await fetchUserProfile();
                } else {
                    localStorage.removeItem('refreshToken');
                }
            }

            setLoading(false);
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            logout,
            user,
            setUser,
            loading,
            refreshAccessToken
        }}>
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