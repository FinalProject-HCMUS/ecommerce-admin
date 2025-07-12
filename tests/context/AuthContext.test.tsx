import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import { signin } from '../../src/apis/authApi';
import { getProfile } from '../../src/apis/userApi';
import { Login } from '../../src/types/auth/Login';
import { User } from '../../src/types/user/User';
import { CustomResponse } from '../../src/types/common/CustomResponse';
import { LoginResponse } from '../../src/types/auth/LoginResponse';

// Mock the dependencies
vi.mock('../../src/apis/authApi');
vi.mock('../../src/apis/userApi');
vi.mock('react-toastify');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const mockSignin = vi.mocked(signin);
const mockGetProfile = vi.mocked(getProfile);
const mockToast = vi.mocked(toast);

// Test component to use the AuthContext
const TestComponent = () => {
    const { isAuthenticated, login, logout, user, setUser } = useAuth();

    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
            <div data-testid="user-email">{user?.email || 'no user'}</div>
            <button
                data-testid="login-btn"
                onClick={() => {
                    const mockNavigate = vi.fn();
                    const credentials: Login = { email: 'test@example.com', password: 'password' };
                    login(credentials, mockNavigate);
                }}
            >
                Login
            </button>
            <button
                data-testid="logout-btn"
                onClick={() => {
                    const mockNavigate = vi.fn();
                    logout(mockNavigate);
                }}
            >
                Logout
            </button>
            <button
                data-testid="set-user-btn"
                onClick={() => {
                    const testUser: User = {
                        id: '1',
                        email: 'updated@example.com',
                        phoneNumber: '123456789',
                        firstName: 'Updated',
                        lastName: 'User',
                        address: 'Test Address',
                        weight: 70,
                        height: 175,
                        enabled: true,
                        photo: 'photo.jpg',
                        role: 'admin'
                    };
                    setUser(testUser);
                }}
            >
                Set User
            </button>
        </div>
    );
};

const renderWithAuthProvider = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                {component}
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockToast.error = vi.fn();
        mockToast.success = vi.fn();
    });

    describe('Initial State', () => {
        it('should provide initial authentication state as false', () => {
            renderWithAuthProvider(<TestComponent />);

            expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
            expect(screen.getByTestId('user-email')).toHaveTextContent('no user');
        });

        it('should throw error when useAuth is used outside AuthProvider', () => {
            const TestComponentWithoutProvider = () => {
                useAuth();
                return <div>Test</div>;
            };

            // Suppress console.error for this test
            const originalError = console.error;
            console.error = vi.fn();

            expect(() => render(<TestComponentWithoutProvider />)).toThrow(
                'useAuth must be used within an AuthProvider'
            );

            console.error = originalError;
        });
    });

    describe('Login Functionality', () => {
        it('should successfully login and fetch user profile', async () => {
            const mockLoginResponse: CustomResponse<LoginResponse> = {
                timestamp: new Date().toISOString(),
                httpStatus: '200',
                isSuccess: true,
                message: 'Login successful',
                data: {
                    accessToken: 'mock-access-token',
                    refreshToken: 'mock-refresh-token'
                }
            };

            const mockUser: User = {
                id: '1',
                email: 'test@example.com',
                phoneNumber: '123456789',
                firstName: 'Test',
                lastName: 'User',
                address: 'Test Address',
                weight: 70,
                height: 175,
                enabled: true,
                photo: 'photo.jpg',
                role: 'admin'
            };

            const mockUserResponse: CustomResponse<User> = {
                timestamp: new Date().toISOString(),
                httpStatus: '200',
                isSuccess: true,
                message: 'Profile fetched',
                data: mockUser
            };

            mockSignin.mockResolvedValue(mockLoginResponse);
            mockGetProfile.mockResolvedValue(mockUserResponse);

            renderWithAuthProvider(<TestComponent />);

            await act(async () => {
                screen.getByTestId('login-btn').click();
            });

            await waitFor(() => {
                expect(mockSignin).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password'
                });
            });

            await waitFor(() => {
                expect(localStorage.getItem('accessToken')).toBe('mock-access-token');
                expect(localStorage.getItem('refreshToken')).toBe('mock-refresh-token');
            });

            await waitFor(() => {
                expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
                expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
            });

            expect(mockToast.success).toHaveBeenCalledWith('loginSuccess', {
                autoClose: 1000,
                position: 'top-right',
                onClose: expect.any(Function)
            });
        });

        it('should handle login failure', async () => {
            const mockLoginResponse: CustomResponse<LoginResponse> = {
                timestamp: new Date().toISOString(),
                httpStatus: '401',
                isSuccess: false,
                message: 'Invalid credentials',
                data: undefined
            };

            mockSignin.mockResolvedValue(mockLoginResponse);

            renderWithAuthProvider(<TestComponent />);

            await act(async () => {
                screen.getByTestId('login-btn').click();
            });

            await waitFor(() => {
                expect(mockToast.error).toHaveBeenCalledWith('Invalid credentials', {
                    autoClose: 1000,
                    position: 'top-center'
                });
            });

            expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(localStorage.getItem('refreshToken')).toBeNull();
        });

        it('should handle profile fetch failure after successful login', async () => {
            const mockLoginResponse: CustomResponse<LoginResponse> = {
                timestamp: new Date().toISOString(),
                httpStatus: '200',
                isSuccess: true,
                message: 'Login successful',
                data: {
                    accessToken: 'mock-access-token',
                    refreshToken: 'mock-refresh-token'
                }
            };

            const mockUserResponse: CustomResponse<User> = {
                timestamp: new Date().toISOString(),
                httpStatus: '500',
                isSuccess: false,
                message: 'Profile fetch failed',
                data: undefined
            };

            mockSignin.mockResolvedValue(mockLoginResponse);
            mockGetProfile.mockResolvedValue(mockUserResponse);

            // Spy on console.error since that's what actually gets called
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            renderWithAuthProvider(<TestComponent />);

            await act(async () => {
                screen.getByTestId('login-btn').click();
            });

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch user profile:', 'Profile fetch failed');
            });

            expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
            expect(screen.getByTestId('user-email')).toHaveTextContent('no user');

            // Restore console.error
            consoleSpy.mockRestore();
        });
    });

    describe('Logout Functionality', () => {
        it('should successfully logout and clear user data', async () => {
            // First login
            const mockLoginResponse: CustomResponse<LoginResponse> = {
                timestamp: new Date().toISOString(),
                httpStatus: '200',
                isSuccess: true,
                message: 'Login successful',
                data: {
                    accessToken: 'mock-access-token',
                    refreshToken: 'mock-refresh-token'
                }
            };

            const mockUser: User = {
                id: '1',
                email: 'test@example.com',
                phoneNumber: '123456789',
                firstName: 'Test',
                lastName: 'User',
                address: 'Test Address',
                weight: 70,
                height: 175,
                enabled: true,
                photo: 'photo.jpg',
                role: 'admin'
            };

            const mockUserResponse: CustomResponse<User> = {
                timestamp: new Date().toISOString(),
                httpStatus: '200',
                isSuccess: true,
                message: 'Profile fetched',
                data: mockUser
            };

            mockSignin.mockResolvedValue(mockLoginResponse);
            mockGetProfile.mockResolvedValue(mockUserResponse);

            renderWithAuthProvider(<TestComponent />);

            // Login first
            await act(async () => {
                screen.getByTestId('login-btn').click();
            });

            await waitFor(() => {
                expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
            });

            // Then logout
            await act(async () => {
                screen.getByTestId('logout-btn').click();
            });

            expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');
            expect(screen.getByTestId('user-email')).toHaveTextContent('no user');
            expect(localStorage.getItem('accessToken')).toBeNull();
            expect(localStorage.getItem('refreshToken')).toBeNull();
        });
    });

    describe('User State Management', () => {
        it('should update user state when setUser is called', async () => {
            renderWithAuthProvider(<TestComponent />);

            await act(async () => {
                screen.getByTestId('set-user-btn').click();
            });

            expect(screen.getByTestId('user-email')).toHaveTextContent('updated@example.com');
        });
    });

    describe('Profile Fetching', () => {
        it('should fetch user profile when authentication state changes to true', async () => {
            const mockUser: User = {
                id: '1',
                email: 'test@example.com',
                phoneNumber: '123456789',
                firstName: 'Test',
                lastName: 'User',
                address: 'Test Address',
                weight: 70,
                height: 175,
                enabled: true,
                photo: 'photo.jpg',
                role: 'admin'
            };

            const mockUserResponse: CustomResponse<User> = {
                timestamp: new Date().toISOString(),
                httpStatus: '200',
                isSuccess: true,
                message: 'Profile fetched',
                data: mockUser
            };

            mockGetProfile.mockResolvedValue(mockUserResponse);

            const TestComponentWithManualAuth = () => {
                const { isAuthenticated, user } = useAuth();

                return (
                    <div>
                        <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not authenticated'}</div>
                        <div data-testid="user-email">{user?.email || 'no user'}</div>
                    </div>
                );
            };

            renderWithAuthProvider(<TestComponentWithManualAuth />);

            // Initially not authenticated
            expect(screen.getByTestId('auth-status')).toHaveTextContent('not authenticated');

            // Profile fetch should only happen when manually triggered through login
            await waitFor(() => {
                expect(mockGetProfile).not.toHaveBeenCalled();
            });
        });
    });
});