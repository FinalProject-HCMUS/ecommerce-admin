import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import { vi } from 'vitest';
import Login from '../../src/pages/Login';

// Mocks
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
vi.mock('../../src/context/AuthContext', () => ({
    useAuth: () => ({
        login: mockLogin,
    }),
}));
vi.mock('../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('Login page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form with default values', () => {
        render(<Login />);
        expect(screen.getByText('adminSignin')).toBeInTheDocument();
        // Find input by label text (label is not "for"-linked, so use getByLabelText fallback)
        const emailInput = screen.getByLabelText('email', { selector: 'input' });
        const passwordInput = screen.getByLabelText('password', { selector: 'input' });
        expect(emailInput).toHaveValue('admin@gmail.com');
        expect(passwordInput).toHaveValue('12345678');
        expect(screen.getByText('signIn')).toBeInTheDocument();
    });

    it('updates email and password fields', () => {
        render(<Login />);
        const emailInput = screen.getByLabelText('email', { selector: 'input' });
        const passwordInput = screen.getByLabelText('password', { selector: 'input' });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'newpass' } });
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('newpass');
    });

    it('calls login with credentials and disables button while saving', async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        render(<Login />);
        const emailInput = screen.getByLabelText('email', { selector: 'input' });
        const passwordInput = screen.getByLabelText('password', { selector: 'input' });
        const button = screen.getByRole('button', { name: 'signIn' });

        fireEvent.change(emailInput, { target: { value: 'user@mail.com' } });
        fireEvent.change(passwordInput, { target: { value: 'pass1234' } });

        fireEvent.click(button);

        expect(button).toBeDisabled();
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(
                { email: 'user@mail.com', password: 'pass1234' },
                mockNavigate
            );
        });
    });

    it('button is enabled after login completes', async () => {
        mockLogin.mockResolvedValueOnce(undefined);
        render(<Login />);
        const button = screen.getByRole('button', { name: 'signIn' });
        fireEvent.click(button);
        await waitFor(() => {
            expect(button).not.toBeDisabled();
        });
    });
});