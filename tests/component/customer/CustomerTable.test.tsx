import { render, screen, fireEvent } from '@testing-library/react';
import CustomerTable from '../../../src/components/customer/CustomerTable';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock useNavigate globally
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return Object.assign({}, actual, {
        useNavigate: () => vi.fn(),
    });
});

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const customers = [
    {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        photo: 'https://example.com/john.jpg',
        address: '123 Main St',
        email: 'john@example.com',
        phoneNumber: '1234567890',
        role: 'User',
        enabled: true,
        weight: 70,
        height: 175,
    },
    {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        photo: 'https://example.com/jane.jpg',
        address: '456 Elm St',
        email: 'jane@example.com',
        phoneNumber: '0987654321',
        role: 'Admin',
        enabled: false,
        weight: 60,
        height: 165,
    },
];

describe('CustomerTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders customer names, addresses, emails, phones, roles, and status', () => {
        render(
            <MemoryRouter>
                <CustomerTable customers={customers} refresh={vi.fn()} />
            </MemoryRouter>
        );
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
        expect(screen.getByText('456 Elm St')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
        expect(screen.getByText('0987654321')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Enabled')).toBeInTheDocument();
        expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('renders customer avatars', () => {
        render(
            <MemoryRouter>
                <CustomerTable customers={customers} refresh={vi.fn()} />
            </MemoryRouter>
        );
        expect(screen.getByAltText('John')).toHaveAttribute('src', 'https://example.com/john.jpg');
        expect(screen.getByAltText('Jane')).toHaveAttribute('src', 'https://example.com/jane.jpg');
    });

    it('navigates to edit page on edit button click', async () => {
        const navigate = vi.fn();
        const routerDom = await import('react-router-dom');
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <MemoryRouter>
                <CustomerTable customers={customers} refresh={vi.fn()} />
            </MemoryRouter>
        );
        const editButtons = screen.getAllByRole('button');
        fireEvent.click(editButtons[0]);
        expect(navigate).toHaveBeenCalledWith('/customers/edit/1');
        fireEvent.click(editButtons[1]);
        expect(navigate).toHaveBeenCalledWith('/customers/edit/2');
    });

    it('renders empty state if no customers', () => {
        render(
            <MemoryRouter>
                <CustomerTable customers={[]} refresh={vi.fn()} />
            </MemoryRouter>
        );
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
});