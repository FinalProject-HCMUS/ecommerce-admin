import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import Preview from '../../../../../src/components/page/order/add-page/Preview';
import * as ReactRouterDom from 'react-router-dom';
// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        Routes: ({ children }: any) => <div>{children}</div>,
        Route: ({ element }: any) => element,
    };
});
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
vi.mock('../../../../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../../../../src/utils/currency', () => ({
    formatProductCost: (amount: number) => `$${amount.toFixed(2)}`,
}));

describe('Preview', () => {
    const mockFormData = {
        firstName: 'Alice',
        lastName: 'Smith',
        phoneNumber: '1234567890',
        address: '123 Main St',
        paymentMethod: 'COD',
        status: 'NEW',
        note: '',
        productCost: 100,
        shippingCost: 10,
        total: 110,
    };

    const mockOrderDetails = [
        {
            itemId: 'item-1',
            product: {
                id: 'p1',
                name: 'Product 1',
                mainImageUrl: '',
            },
            unitPrice: 50,
            quantity: 2,
            color: { id: 'red', name: 'Red', code: '#ff0000' },
            size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
        },
    ];

    it('renders customer and order summary information', () => {
        render(
            <Preview
                formData={mockFormData as any}
                orderDetails={mockOrderDetails as any}
                handleSubmit={vi.fn()}
                loading={false}
            />
        );
        expect(screen.getByText('orderPreview')).toBeInTheDocument();
        expect(screen.getByText('headerCustomer')).toBeInTheDocument();
        expect(screen.getByText('fullName:')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('phone:')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
        expect(screen.getByText('address:')).toBeInTheDocument();
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
        expect(screen.getByText('paymentMethod:')).toBeInTheDocument();
        expect(screen.getByText('COD')).toBeInTheDocument();
        expect(screen.getByText('status:')).toBeInTheDocument();
        expect(screen.getByText('NEW')).toBeInTheDocument();
        expect(screen.getByText('orderDetail')).toBeInTheDocument();
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('size: L')).toBeInTheDocument();
        expect(screen.getByText('color: Red')).toBeInTheDocument();
        expect(screen.getByText('x2')).toBeInTheDocument();
        expect(screen.getByText('orderSummary')).toBeInTheDocument();
        expect(screen.getByText('subtotal')).toBeInTheDocument();
        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.getByText('shippingCost')).toBeInTheDocument();
        expect(screen.getByText('$10.00')).toBeInTheDocument();
        expect(screen.getByText('total')).toBeInTheDocument();
        expect(screen.getByText('$110.00')).toBeInTheDocument();
    });

    it('calls handleSubmit when createOrder button is clicked', () => {
        const handleSubmit = vi.fn();
        render(
            <Preview
                formData={mockFormData as any}
                orderDetails={mockOrderDetails as any}
                handleSubmit={handleSubmit}
                loading={false}
            />
        );
        fireEvent.click(screen.getByText('createOrder'));
        expect(handleSubmit).toHaveBeenCalled();
    });

    it('disables createOrder button when loading', () => {
        render(
            <Preview
                formData={mockFormData as any}
                orderDetails={mockOrderDetails as any}
                handleSubmit={vi.fn()}
                loading={true}
            />
        );
        expect(screen.getByText('createOrder')).toBeDisabled();
    });

    it('navigates back when back button is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(ReactRouterDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <Preview
                formData={mockFormData as any}
                orderDetails={mockOrderDetails as any}
                handleSubmit={vi.fn()}
                loading={false}
            />
        );
        fireEvent.click(screen.getByText('back'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });
});