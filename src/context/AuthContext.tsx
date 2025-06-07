import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Login } from '../types/auth/Login';
import { signin } from '../apis/authApi';
import { User } from '../types/user/User';
import { getProfile } from '../apis/userApi';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (credentials: Login, navigate: ReturnType<typeof useNavigate>) => void;
    logout: (navigate: ReturnType<typeof useNavigate>) => void;
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    loading: boolean; // Add this
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true); // Add this

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
        toast.success('Login successful', {
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
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsAuthenticated(true);
            fetchUserProfile().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user, setUser, loading }}>
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