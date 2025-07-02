import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import IncompleteOrderTable from '../../../src/components/statistics/IncompleteOrderTable';
import { IncompletedOrder } from '../../../src/types/statistics/IncompletedOrder';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: 'en'
        }
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { }
    }
}));

// Mock the currency utility
vi.mock('../../../src/utils/currency', () => ({
    formatProductCost: (amount: number) => `$${amount.toFixed(2)}`,
}));

// Mock date-fns
vi.mock('date-fns', () => ({
    format: vi.fn(() => 'January 15, 2024, 02:30 PM')
}));

describe('IncompleteOrderTable', () => {
    const mockOrders: IncompletedOrder[] = [
        {
            orderId: 'order-1',
            buyername: 'John Doe',
            purchasedate: '2024-01-15T14:30:00Z',
            paymentmethod: 'Credit Card',
            revenue: 150000
        },
        {
            orderId: 'order-2',
            buyername: 'Jane Smith',
            purchasedate: '2024-01-16T10:15:00Z',
            paymentmethod: 'Cash',
            revenue: 75000
        },
        {
            orderId: 'order-3',
            buyername: 'Bob Johnson',
            purchasedate: '2024-01-17T16:45:00Z',
            paymentmethod: 'Bank Transfer',
            revenue: 220000
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders table headers correctly', () => {
        render(<IncompleteOrderTable orders={mockOrders} />);

        expect(screen.getByText('customer')).toBeInTheDocument();
        expect(screen.getByText('orderTime')).toBeInTheDocument();
        expect(screen.getByText('paymentMethod')).toBeInTheDocument();
        expect(screen.getByText('revenue')).toBeInTheDocument();
    });

    it('renders order data correctly', () => {
        render(<IncompleteOrderTable orders={mockOrders} />);

        // Check customer names
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();

        // Check payment methods
        expect(screen.getByText('Credit Card')).toBeInTheDocument();
        expect(screen.getByText('Cash')).toBeInTheDocument();
        expect(screen.getByText('Bank Transfer')).toBeInTheDocument();
    });

    it('formats dates correctly using date-fns format', () => {
        render(<IncompleteOrderTable orders={mockOrders} />);

        // Since we mocked date-fns to return a consistent format, check for the mocked output
        const dateElements = screen.getAllByText('January 15, 2024, 02:30 PM');
        expect(dateElements).toHaveLength(3); // One for each order due to our mock
    });

    it('formats revenue using formatProductCost', () => {
        render(<IncompleteOrderTable orders={mockOrders} />);

        // Check that revenue is formatted correctly using our mock
        expect(screen.getByText('$150000.00')).toBeInTheDocument();
        expect(screen.getByText('$75000.00')).toBeInTheDocument();
        expect(screen.getByText('$220000.00')).toBeInTheDocument();
    });

    it('renders empty table when no orders provided', () => {
        render(<IncompleteOrderTable orders={[]} />);

        // Headers should still be present
        expect(screen.getByText('customer')).toBeInTheDocument();
        expect(screen.getByText('orderTime')).toBeInTheDocument();
        expect(screen.getByText('paymentMethod')).toBeInTheDocument();
        expect(screen.getByText('revenue')).toBeInTheDocument();

        // But no order data should be present
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('renders table with proper structure and classes', () => {
        render(<IncompleteOrderTable orders={mockOrders} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
        expect(table).toHaveClass('min-w-full', 'divide-y', 'divide-gray-200');

        // Check for thead
        const thead = table.querySelector('thead');
        expect(thead).toBeInTheDocument();
        expect(thead).toHaveClass('bg-gray-50');

        // Check for tbody
        const tbody = table.querySelector('tbody');
        expect(tbody).toBeInTheDocument();
        expect(tbody).toHaveClass('bg-white', 'divide-y', 'divide-gray-200');
    });

    it('handles single order correctly', () => {
        const singleOrder: IncompletedOrder[] = [
            {
                orderId: 'single-order',
                buyername: 'Single Customer',
                purchasedate: '2024-01-20T12:00:00Z',
                paymentmethod: 'PayPal',
                revenue: 100000
            }
        ];

        render(<IncompleteOrderTable orders={singleOrder} />);

        expect(screen.getByText('Single Customer')).toBeInTheDocument();
        expect(screen.getByText('PayPal')).toBeInTheDocument();
        expect(screen.getByText('$100000.00')).toBeInTheDocument();
        expect(screen.getByText('January 15, 2024, 02:30 PM')).toBeInTheDocument();
    });

    it('handles orders with zero revenue', () => {
        const zeroRevenueOrders: IncompletedOrder[] = [
            {
                orderId: 'zero-order',
                buyername: 'Zero Customer',
                purchasedate: '2024-01-21T09:00:00Z',
                paymentmethod: 'Credit Card',
                revenue: 0
            }
        ];

        render(<IncompleteOrderTable orders={zeroRevenueOrders} />);

        expect(screen.getByText('Zero Customer')).toBeInTheDocument();
        expect(screen.getByText('Credit Card')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();
    });

    it('renders correct number of rows for given orders', () => {
        render(<IncompleteOrderTable orders={mockOrders} />);

        const table = screen.getByRole('table');
        const tbody = table.querySelector('tbody');
        const rows = tbody?.querySelectorAll('tr');

        expect(rows).toHaveLength(3); // Should match the number of mock orders
    });

    it('displays order IDs as table row keys (not visible but used for React)', () => {
        render(<IncompleteOrderTable orders={mockOrders} />);

        const table = screen.getByRole('table');
        const tbody = table.querySelector('tbody');
        const rows = tbody?.querySelectorAll('tr');

        // Check that rows exist (React keys are not visible in DOM but ensure no key warnings)
        expect(rows).toHaveLength(3);
        expect(rows?.[0]).toBeInTheDocument();
        expect(rows?.[1]).toBeInTheDocument();
        expect(rows?.[2]).toBeInTheDocument();
    });

    it('handles different payment methods correctly', () => {
        const diversePaymentOrders: IncompletedOrder[] = [
            {
                orderId: 'order-visa',
                buyername: 'Visa User',
                purchasedate: '2024-01-22T14:00:00Z',
                paymentmethod: 'Visa',
                revenue: 50000
            },
            {
                orderId: 'order-mastercard',
                buyername: 'Mastercard User',
                purchasedate: '2024-01-23T15:00:00Z',
                paymentmethod: 'Mastercard',
                revenue: 60000
            },
            {
                orderId: 'order-cod',
                buyername: 'COD User',
                purchasedate: '2024-01-24T16:00:00Z',
                paymentmethod: 'Cash on Delivery',
                revenue: 70000
            }
        ];

        render(<IncompleteOrderTable orders={diversePaymentOrders} />);

        expect(screen.getByText('Visa')).toBeInTheDocument();
        expect(screen.getByText('Mastercard')).toBeInTheDocument();
        expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
    });
});
