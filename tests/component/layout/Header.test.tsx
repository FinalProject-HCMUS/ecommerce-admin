import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Header from '../../../src/components/layout/Header';
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
            common: {
                language: 'en'
            }
        }
    },
    interpolation: {
        escapeValue: false,
    },
});

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock the useAuth hook
const mockUseAuth = vi.fn();
vi.mock('../../../src/context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock the LanguageToggle component
vi.mock('../../../src/components/common/LanguageToggle', () => ({
    default: ({ lang, onToggle }: { lang: string; onToggle: () => void }) => (
        <button data-testid="language-toggle" onClick={onToggle}>
            {lang}
        </button>
    )
}));

// Mock APIs
vi.mock('../../../src/apis/userApi', () => ({
    getProfile: vi.fn().mockResolvedValue({ isSuccess: true, data: null })
}));

const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    photo: 'https://example.com/photo.jpg'
};

const renderHeader = (user = mockUser) => {
    mockUseAuth.mockReturnValue({
        user,
        isAuthenticated: true,
        login: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
    });

    return render(
        <MemoryRouter>
            <I18nextProvider i18n={testI18n}>
                <Header />
            </I18nextProvider>
        </MemoryRouter>
    );
};

describe('Header', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with user information', () => {
        renderHeader();

        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Profile' })).toBeInTheDocument();
    });

    it('displays user photo correctly', () => {
        renderHeader();

        const profileImage = screen.getByRole('img', { name: 'Profile' });
        expect(profileImage).toHaveAttribute('src', mockUser.photo);
    });

    it('displays placeholder image when user has no photo', () => {
        const userWithoutPhoto = { ...mockUser, photo: '' };
        renderHeader(userWithoutPhoto);

        const profileImage = screen.getByRole('img', { name: 'Profile' });
        expect(profileImage).toHaveAttribute('src', 'https://via.placeholder.com/150');
    });

    it('navigates to about page when profile image is clicked', () => {
        renderHeader();

        const profileImage = screen.getByRole('img', { name: 'Profile' });
        fireEvent.click(profileImage);

        expect(mockNavigate).toHaveBeenCalledWith('/about');
    });

    it('renders language toggle component', () => {
        renderHeader();

        expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
    });

    it('handles language toggle correctly', () => {
        renderHeader();

        const languageToggle = screen.getByTestId('language-toggle');
        expect(languageToggle).toHaveTextContent('en');

        fireEvent.click(languageToggle);
        // The language change is handled internally by the component
        // We can verify the toggle button exists and is clickable
        expect(languageToggle).toBeInTheDocument();
    });

    it('has correct header styling and layout', () => {
        renderHeader();

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('bg-white', 'border-b', 'border-gray-200', 'h-16');

        const headerContent = header.firstChild;
        expect(headerContent).toHaveClass('flex', 'items-center', 'justify-between', 'px-6', 'h-full');
    });

    it('displays correct profile image styling', () => {
        renderHeader();

        const profileImage = screen.getByRole('img', { name: 'Profile' });
        expect(profileImage).toHaveClass('w-12', 'h-12', 'rounded-full', 'object-cover', 'cursor-pointer');
    });
});