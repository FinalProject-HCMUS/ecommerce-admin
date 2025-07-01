import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import About from '../../src/pages/About';

// Mocks
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: { language: 'en' },
    }),
}));
vi.mock('lucide-react', () => ({
    KeyRound: () => <svg data-testid="icon-key" />,
    Pencil: () => <svg data-testid="icon-pencil" />,
}));
vi.mock('../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    email: 'john@example.com',
    phoneNumber: '123456789',
    enabled: true,
    height: 180,
    weight: 75,
    address: '123 Main St',
    photo: 'profile.jpg',
};
vi.mock('../../src/context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
    }),
}));

describe('About page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders user profile information', () => {
        render(<About />);
        expect(screen.getByText('about')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        // Use getAllByText for possibly duplicated text
        expect(screen.getAllByText('admin').length).toBeGreaterThan(0);
        expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'profile.jpg');
        expect(screen.getByText('personalInfo')).toBeInTheDocument();
        expect(screen.getByText('firstName')).toBeInTheDocument();
        expect(screen.getByText('lastName')).toBeInTheDocument();
        expect(screen.getByText('userRole')).toBeInTheDocument();
        expect(screen.getByText('email')).toBeInTheDocument();
        expect(screen.getByText('phone')).toBeInTheDocument();
        expect(screen.getByText('enabled')).toBeInTheDocument();
        expect(screen.getByText('height')).toBeInTheDocument();
        expect(screen.getByText('weight')).toBeInTheDocument();
        expect(screen.getByText('address')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('123456789')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('180 cm')).toBeInTheDocument();
        expect(screen.getByText('75 kg')).toBeInTheDocument();
        expect(screen.getByText('123 Main St kg')).toBeInTheDocument();
    });

    it('navigates to change password when button is clicked', () => {
        render(<About />);
        fireEvent.click(screen.getByText('changePassword'));
        expect(mockNavigate).toHaveBeenCalledWith('/about/change-password');
    });

    it('navigates to edit page when edit button is clicked', () => {
        render(<About />);
        fireEvent.click(screen.getByText('edit'));
        expect(mockNavigate).toHaveBeenCalledWith('/about/edit');
    });

    it('renders icons', () => {
        render(<About />);
        expect(screen.getByTestId('icon-key')).toBeInTheDocument();
        expect(screen.getByTestId('icon-pencil')).toBeInTheDocument();
    });

    it('does not render profile if user is null', async () => {
        vi.resetModules();
        vi.doMock('../../src/context/AuthContext', () => ({
            useAuth: () => ({
                user: null,
            }),
        }));
        const { default: AboutPage } = await import('../../src/pages/About');
        render(<AboutPage />);
        // Check for absence of profile info, not just 'about' text
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
    });
});