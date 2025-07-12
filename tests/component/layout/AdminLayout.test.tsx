import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import AdminLayout from '../../../src/components/layout/AdminLayout';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import React from 'react';

// Create a simple i18n instance for testing
const testI18n = i18n.createInstance();
testI18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: {
            common: {}
        }
    },
    interpolation: {
        escapeValue: false,
    },
});

// Mock the child components
vi.mock('../../../src/components/layout/Sidebar', () => ({
    default: () => <div data-testid="sidebar">Sidebar</div>
}));

vi.mock('../../../src/components/layout/Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../../src/context/AuthContext', async () => {
    const actual = await vi.importActual('../../../src/context/AuthContext');
    return {
        ...actual,
        useAuth: () => mockUseAuth(),
    };
});

// Mock APIs
vi.mock('../../../src/apis/userApi', () => ({
    getProfile: vi.fn().mockResolvedValue({ isSuccess: true, data: null })
}));

vi.mock('../../../src/apis/authApi', () => ({
    signin: vi.fn()
}));

const renderAdminLayout = (isAuthenticated = true) => {
    mockUseAuth.mockReturnValue({
        isAuthenticated,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
    });

    return render(
        <MemoryRouter>
            <I18nextProvider i18n={testI18n}>
                <AdminLayout />
            </I18nextProvider>
        </MemoryRouter>
    );
};

describe('AdminLayout', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly when user is authenticated', () => {
        renderAdminLayout(true);

        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('does not render sidebar and header when user is not authenticated', () => {
        renderAdminLayout(false);

        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
        expect(screen.queryByTestId('header')).not.toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('has correct layout structure and CSS classes', () => {
        renderAdminLayout(true);

        const mainContainer = screen.getByRole('main').parentElement?.parentElement;
        expect(mainContainer).toHaveClass('flex', 'h-screen', 'bg-gray-100');

        const contentArea = screen.getByRole('main').parentElement;
        expect(contentArea).toHaveClass('flex-1', 'flex', 'flex-col', 'overflow-hidden');

        const main = screen.getByRole('main');
        expect(main).toHaveClass('flex-1', 'overflow-x-hidden', 'overflow-y-auto');
    });

    it('renders outlet for nested routes', () => {
        renderAdminLayout(true);

        // The main element should be present for the Outlet to render into
        expect(screen.getByRole('main')).toBeInTheDocument();
    });
});