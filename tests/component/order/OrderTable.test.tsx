import { render, screen, fireEvent } from '@testing-library/react';
import OrderTable from '../../../src/components/order/OrderTable';
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

const orders = [
    {
        id: '1',
        firstName: 'Alice',
        lastName: 'Wonderland',
        address: '123 Fantasy Rd',
        deliveryDate: '2024-07-01T10:30:00Z',
        paymentMethod: 'Credit Card',
        status: 'Pending',
        phoneNumber: '123-456-7890',
        shippingCost: 10,
        productCost: 100,
        subTotal: 110,
        total: 120,
        customerId: 'customer-1',
        // Add any other required fields with mock values as per the Order interface
    },
    {
        id: '2',
        firstName: 'Bob',
        lastName: 'Builder',
        address: '456 Construction Ave',
        deliveryDate: '2024-07-02T15:45:00Z',
        paymentMethod: 'Cash',
        status: 'Completed',
        phoneNumber: '987-654-3210',
        shippingCost: 15,
        productCost: 200,
        subTotal: 215,
        total: 230,
        customerId: 'customer-2',
        // Add any other required fields with mock values as per the Order interface
    },
];

describe('OrderTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders order customer names, addresses, payment methods, and status', () => {
        render(
            <MemoryRouter>
                <OrderTable orders={orders} />
            </MemoryRouter>
        );
        expect(screen.getByText('Alice Wonderland')).toBeInTheDocument();
        expect(screen.getByText('Bob Builder')).toBeInTheDocument();
        expect(screen.getByText('123 Fantasy Rd')).toBeInTheDocument();
        expect(screen.getByText('456 Construction Ave')).toBeInTheDocument();
        expect(screen.getByText('Credit Card')).toBeInTheDocument();
        expect(screen.getByText('Cash')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('navigates to edit page on edit button click', async () => {
        const navigate = vi.fn();
        const routerDom = await import('react-router-dom');
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <MemoryRouter>
                <OrderTable orders={orders} />
            </MemoryRouter>
        );
        const editButtons = screen.getAllByRole('button');
        fireEvent.click(editButtons[0]);
        expect(navigate).toHaveBeenCalledWith('/orders/edit/1/information');
        fireEvent.click(editButtons[1]);
        expect(navigate).toHaveBeenCalledWith('/orders/edit/2/information');
    });

    it('renders empty state if no orders', () => {
        render(
            <MemoryRouter>
                <OrderTable orders={[]} />
            </MemoryRouter>
        );
        expect(screen.queryByText('Alice Wonderland')).not.toBeInTheDocument();
        expect(screen.queryByText('Bob Builder')).not.toBeInTheDocument();
    });
});