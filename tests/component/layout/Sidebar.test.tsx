import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import Sidebar from '../../../src/components/layout/Sidebar';
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
            sidebar: {
                title: 'Admin Dashboard',
                customers: 'Customers',
                products: 'Products',
                colors: 'Colors',
                sizes: 'Sizes',
                categories: 'Categories',
                orders: 'Orders',
                messages: 'Messages',
                blog: 'Blog',
                statistics: 'Statistics',
                revenueAnalysis: 'Revenue Analysis',
                productCategory: 'Product Category',
                orderStatistics: 'Order Statistics',
                topProducts: 'Top Products',
                about: 'About',
                settings: 'Settings',
                logout: 'Logout'
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
const mockLogout = vi.fn();
const mockUseAuth = vi.fn();
vi.mock('../../../src/context/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock lucide-react icons to render as simple divs with test ids
vi.mock('lucide-react', () => ({
    Package: () => React.createElement('div', { 'data-testid': 'package-icon' }),
    List: () => React.createElement('div', { 'data-testid': 'list-icon' }),
    LogOut: () => React.createElement('div', { 'data-testid': 'logout-icon' }),
    Palette: () => React.createElement('div', { 'data-testid': 'palette-icon' }),
    RulerIcon: () => React.createElement('div', { 'data-testid': 'ruler-icon' }),
    Info: () => React.createElement('div', { 'data-testid': 'info-icon' }),
    Settings: () => React.createElement('div', { 'data-testid': 'settings-icon' }),
    Users: () => React.createElement('div', { 'data-testid': 'users-icon' }),
    Boxes: () => React.createElement('div', { 'data-testid': 'boxes-icon' }),
    MessageCircleMore: () => React.createElement('div', { 'data-testid': 'message-circle-more-icon' }),
    NotebookPen: () => React.createElement('div', { 'data-testid': 'notebook-pen-icon' }),
    BarChart3Icon: () => React.createElement('div', { 'data-testid': 'bar-chart-3-icon' }),
    ChevronUp: () => React.createElement('div', { 'data-testid': 'chevron-up-icon' }),
    ChevronDown: () => React.createElement('div', { 'data-testid': 'chevron-down-icon' }),
}));

// Mock APIs
vi.mock('../../../src/apis/userApi', () => ({
    getProfile: vi.fn().mockResolvedValue({ isSuccess: true, data: null })
}));

const renderSidebar = (initialRoute = '/') => {
    mockUseAuth.mockReturnValue({
        logout: mockLogout,
        isAuthenticated: true,
        user: null,
        login: vi.fn(),
        setUser: vi.fn(),
    });

    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <I18nextProvider i18n={testI18n}>
                <Sidebar />
            </I18nextProvider>
        </MemoryRouter>
    );
};

describe('Sidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with all navigation links', () => {
        renderSidebar();

        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Customers')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Colors')).toBeInTheDocument();
        expect(screen.getByText('Sizes')).toBeInTheDocument();
        expect(screen.getByText('Categories')).toBeInTheDocument();
        expect(screen.getByText('Orders')).toBeInTheDocument();
        expect(screen.getByText('Messages')).toBeInTheDocument();
        expect(screen.getByText('Blog')).toBeInTheDocument();
        expect(screen.getByText('Statistics')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    it('renders all navigation links with correct hrefs', () => {
        renderSidebar();

        expect(screen.getByRole('link', { name: /customers/i })).toHaveAttribute('href', '/customers');
        expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('href', '/products');
        expect(screen.getByRole('link', { name: /colors/i })).toHaveAttribute('href', '/colors');
        expect(screen.getByRole('link', { name: /sizes/i })).toHaveAttribute('href', '/sizes');
        expect(screen.getByRole('link', { name: /categories/i })).toHaveAttribute('href', '/categories');
        expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('href', '/orders');
        expect(screen.getByRole('link', { name: /messages/i })).toHaveAttribute('href', '/messages');
        expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blogs');
        expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
        expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute('href', '/settings');
    });

    it('applies active styling to current route', () => {
        renderSidebar('/products');

        const productsLink = screen.getByRole('link', { name: /products/i });
        expect(productsLink).toHaveClass('bg-blue-500', 'text-white');
    });

    it('applies inactive styling to non-current routes', () => {
        renderSidebar('/products');

        const colorsLink = screen.getByRole('link', { name: /colors/i });
        expect(colorsLink).toHaveClass('text-gray-600', 'hover:bg-blue-50', 'hover:text-blue-600');
    });

    it('renders all navigation icons', () => {
        renderSidebar();

        // Check that icons are rendered using our mocked components
        expect(screen.getByTestId('users-icon')).toBeInTheDocument();
        expect(screen.getByTestId('package-icon')).toBeInTheDocument();
        expect(screen.getByTestId('palette-icon')).toBeInTheDocument();
        expect(screen.getByTestId('ruler-icon')).toBeInTheDocument();
        expect(screen.getByTestId('list-icon')).toBeInTheDocument();
        expect(screen.getByTestId('boxes-icon')).toBeInTheDocument();
        expect(screen.getByTestId('message-circle-more-icon')).toBeInTheDocument();
        expect(screen.getByTestId('notebook-pen-icon')).toBeInTheDocument();
        expect(screen.getByTestId('bar-chart-3-icon')).toBeInTheDocument();
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument(); // Statistics dropdown should be closed by default
        expect(screen.getByTestId('info-icon')).toBeInTheDocument();
        expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });

    it('calls logout function when logout button is clicked', () => {
        renderSidebar();

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        expect(mockLogout).toHaveBeenCalledWith(mockNavigate);
    });

    it('has correct logout button styling', () => {
        renderSidebar();

        const logoutButton = screen.getByRole('button', { name: /logout/i });
        expect(logoutButton).toHaveClass('flex', 'items-center', 'space-x-2', 'text-gray-600', 'hover:text-gray-900', 'w-full');
    });

    it('renders title with correct styling', () => {
        renderSidebar();

        const title = screen.getByText('Admin Dashboard');
        expect(title).toHaveClass('text-xl', 'font-bold', 'text-blue-600');
    });

    it('has correct navigation structure', () => {
        renderSidebar();

        const nav = screen.getByRole('navigation');
        expect(nav).toHaveClass('flex-1', 'p-4', 'space-y-1');
    });

    it('has correct logout section styling', () => {
        renderSidebar();

        const logoutSection = screen.getByRole('button', { name: /logout/i }).parentElement;
        expect(logoutSection).toHaveClass('p-4', 'border-t', 'border-gray-200');
    });

    describe('Navigation Link Interactions', () => {
        const routes = [
            { path: '/customers', name: 'Customers' },
            { path: '/products', name: 'Products' },
            { path: '/colors', name: 'Colors' },
            { path: '/sizes', name: 'Sizes' },
            { path: '/categories', name: 'Categories' },
            { path: '/orders', name: 'Orders' },
            { path: '/messages', name: 'Messages' },
            { path: '/blogs', name: 'Blog' },
            { path: '/about', name: 'About' },
            { path: '/settings', name: 'Settings' },
        ];

        routes.forEach(({ path, name }) => {
            it(`highlights ${name} when on ${path} route`, () => {
                renderSidebar(path);

                const link = screen.getByRole('link', { name: new RegExp(name, 'i') });
                expect(link).toHaveClass('bg-blue-500', 'text-white');
            });
        });
    });

    describe('Statistics Dropdown', () => {
        it('renders statistics button with dropdown closed by default', () => {
            renderSidebar();

            const statisticsButton = screen.getByRole('button', { name: /statistics/i });
            expect(statisticsButton).toBeInTheDocument();
            expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();

            // Statistics dropdown items should not be visible initially
            expect(screen.queryByText('Revenue Analysis')).not.toBeInTheDocument();
            expect(screen.queryByText('Product Category')).not.toBeInTheDocument();
            expect(screen.queryByText('Order Statistics')).not.toBeInTheDocument();
            expect(screen.queryByText('Top Products')).not.toBeInTheDocument();
        });

        it('opens statistics dropdown when clicked', () => {
            renderSidebar();

            const statisticsButton = screen.getByRole('button', { name: /statistics/i });
            fireEvent.click(statisticsButton);

            // After clicking, chevron should change and dropdown items should be visible
            expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
            expect(screen.getByText('Revenue Analysis')).toBeInTheDocument();
            expect(screen.getByText('Product Category')).toBeInTheDocument();
            expect(screen.getByText('Order Statistics')).toBeInTheDocument();
            expect(screen.getByText('Top Products')).toBeInTheDocument();
        });

        it('closes statistics dropdown when clicked again', () => {
            renderSidebar();

            const statisticsButton = screen.getByRole('button', { name: /statistics/i });

            // Open dropdown
            fireEvent.click(statisticsButton);
            expect(screen.getByText('Revenue Analysis')).toBeInTheDocument();

            // Close dropdown
            fireEvent.click(statisticsButton);
            expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
            expect(screen.queryByText('Revenue Analysis')).not.toBeInTheDocument();
        });

        it('renders statistics dropdown items with correct hrefs when open', () => {
            renderSidebar();

            const statisticsButton = screen.getByRole('button', { name: /statistics/i });
            fireEvent.click(statisticsButton);

            expect(screen.getByRole('link', { name: /revenue analysis/i })).toHaveAttribute('href', '/statistics/revenue');
            expect(screen.getByRole('link', { name: /product category/i })).toHaveAttribute('href', '/statistics/categories');
            expect(screen.getByRole('link', { name: /order statistics/i })).toHaveAttribute('href', '/statistics/orders');
            expect(screen.getByRole('link', { name: /top products/i })).toHaveAttribute('href', '/statistics/top-products');
        });

        it('highlights statistics dropdown items when on their routes', () => {
            renderSidebar('/statistics/revenue');

            // Open dropdown to see the links
            const statisticsButton = screen.getByRole('button', { name: /statistics/i });
            fireEvent.click(statisticsButton);

            const revenueLink = screen.getByRole('link', { name: /revenue analysis/i });
            expect(revenueLink).toHaveClass('bg-blue-500', 'text-white');
        });
    });
});