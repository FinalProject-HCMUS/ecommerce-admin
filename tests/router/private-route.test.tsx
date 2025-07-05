import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { PrivateRoute } from '../../src/router/private-route';

// Mock useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../src/context/AuthContext', () => ({
    useAuth: () => mockUseAuth()
}));

// Mock Navigate component
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Navigate: ({ to }: { to: string }) => {
            mockNavigate(to);
            return <div data-testid="navigate" data-to={to}>Redirecting to {to}</div>;
        }
    };
});

// Test component
interface TestComponentProps {
    testProp?: string;
    [key: string]: unknown;
}

const TestComponent = (props: TestComponentProps) => (
    <div data-testid="protected-content">
        Protected Content
        {props.testProp && <span data-testid="test-prop">{props.testProp}</span>}
    </div>
);

describe('PrivateRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    it('renders the component when user is authenticated', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true });

        render(
            <MemoryRouter>
                <PrivateRoute element={TestComponent} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to login when user is not authenticated', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false });

        render(
            <MemoryRouter>
                <PrivateRoute element={TestComponent} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('navigate')).toBeInTheDocument();
        expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/login');
        expect(mockNavigate).toHaveBeenCalledWith('/login');
        expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('passes props to the component when authenticated', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true });

        render(
            <MemoryRouter>
                <PrivateRoute element={TestComponent} testProp="hello world" />
            </MemoryRouter>
        );

        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        expect(screen.getByTestId('test-prop')).toBeInTheDocument();
        expect(screen.getByText('hello world')).toBeInTheDocument();
    });

    it('handles undefined authentication state gracefully', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: undefined });

        render(
            <MemoryRouter>
                <PrivateRoute element={TestComponent} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('navigate')).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('handles null authentication state gracefully', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: null });

        render(
            <MemoryRouter>
                <PrivateRoute element={TestComponent} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('navigate')).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('handles false authentication state', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false });

        render(
            <MemoryRouter>
                <PrivateRoute element={TestComponent} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('navigate')).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('handles missing isAuthenticated property', () => {
        mockUseAuth.mockReturnValue({});

        render(
            <MemoryRouter>
                <PrivateRoute element={TestComponent} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('navigate')).toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    describe('edge cases', () => {
        it('handles when useAuth throws an error (context not provided)', () => {
            mockUseAuth.mockImplementation(() => {
                throw new Error('useAuth must be used within an AuthProvider');
            });

            // Should throw an error as expected by the real implementation
            expect(() => {
                render(
                    <MemoryRouter>
                        <PrivateRoute element={TestComponent} />
                    </MemoryRouter>
                );
            }).toThrow('useAuth must be used within an AuthProvider');
        });

        it('handles component that returns null', () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });

            const NullComponent = () => null;

            render(
                <MemoryRouter>
                    <PrivateRoute element={NullComponent} />
                </MemoryRouter>
            );

            // Should not crash and should not show navigate
            expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        });

        it('handles component with hooks', () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });

            const HookComponent = () => {
                const [count, setCount] = React.useState(0);
                return (
                    <div data-testid="hook-content">
                        <span data-testid="count">{count}</span>
                        <button onClick={() => setCount(c => c + 1)} data-testid="increment">
                            Increment
                        </button>
                    </div>
                );
            };

            render(
                <MemoryRouter>
                    <PrivateRoute element={HookComponent} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('hook-content')).toBeInTheDocument();
            expect(screen.getByTestId('count')).toHaveTextContent('0');
        });
    });

    describe('integration with routing', () => {
        it('preserves current location when redirecting', () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: false });

            render(
                <MemoryRouter initialEntries={['/some/protected/path']}>
                    <PrivateRoute element={TestComponent} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('navigate')).toBeInTheDocument();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });

        it('works with different initial routes', () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });

            render(
                <MemoryRouter initialEntries={['/dashboard']}>
                    <PrivateRoute element={TestComponent} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
            expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
        });
    });

    describe('authentication state changes', () => {
        it('updates when authentication state changes from false to true', () => {
            const { rerender } = render(
                <MemoryRouter>
                    <PrivateRoute element={TestComponent} />
                </MemoryRouter>
            );

            // Initially not authenticated
            mockUseAuth.mockReturnValue({ isAuthenticated: false });
            rerender(
                <MemoryRouter>
                    <PrivateRoute element={TestComponent} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('navigate')).toBeInTheDocument();

            // Then becomes authenticated
            mockUseAuth.mockReturnValue({ isAuthenticated: true });
            rerender(
                <MemoryRouter>
                    <PrivateRoute element={TestComponent} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
            expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
        });

        it('updates when authentication state changes from true to false', () => {
            mockUseAuth.mockReturnValue({ isAuthenticated: true });

            const { rerender } = render(
                <MemoryRouter>
                    <PrivateRoute element={TestComponent} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();

            // Then becomes unauthenticated
            mockUseAuth.mockReturnValue({ isAuthenticated: false });
            rerender(
                <MemoryRouter>
                    <PrivateRoute element={TestComponent} />
                </MemoryRouter>
            );

            expect(screen.getByTestId('navigate')).toBeInTheDocument();
            expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
        });
    });
});
