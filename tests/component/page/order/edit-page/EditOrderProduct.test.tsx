import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import EditOrderProduct from '../../../../../src/components/page/order/edit-page/EditOrderProduct';

// Mocks
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));
vi.mock('../../../../../src/apis/productApi', () => ({
    getProducts: vi.fn().mockResolvedValue({
        isSuccess: true,
        data: {
            content: [
                { id: 'p1', name: 'Product 1', price: 100, cost: 80, mainImageUrl: '', color: [], size: [] },
            ],
            totalPages: 1,
        },
    }),
}));
vi.mock('../../../../../src/components/product/ProductPickerDialog', () => ({
    __esModule: true,
    default: ({ products, onProductSelect }: any) => (
        <div>
            {products.map((p: any) => (
                <button key={p.id} onClick={() => onProductSelect(p)}>
                    {p.name}
                </button>
            ))}
        </div>
    ),
}));
vi.mock('../../../../../src/components/product/ProductColorSizeDialog', () => ({
    __esModule: true,
    default: ({ isOpen, onPick }: any) =>
        isOpen ? (
            <button onClick={() => onPick({ id: 'cs1', color: { id: 'red', name: 'Red', code: '#ff0000' }, size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 }, productId: 'p1', quantity: 5 })}>
                Pick ColorSize
            </button>
        ) : null,
}));
vi.mock('../../../../../src/components/common/Pagination', () => ({
    __esModule: true,
    default: ({ currentPage, totalPages, onPageChange }: any) => (
        <div>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
        </div>
    ),
}));

import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('EditOrderProduct', () => {
    const defaultOrderDetails = [];
    const defaultFormData = {
        id: 'order-1',
        productCost: 0,
        shippingCost: 0,
        total: 0,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders product picker and order summary', async () => {
        render(
            <EditOrderProduct
                orderDetails={defaultOrderDetails as any}
                setOrderDetails={vi.fn()}
                formData={defaultFormData as any}
                setFormData={vi.fn()}
            />
        );
        expect(await screen.findByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('orderSummary')).toBeInTheDocument();
        expect(screen.getByText('next')).toBeInTheDocument();
        expect(screen.getByText('back')).toBeInTheDocument();
    });

    it('calls setOrderDetails and setFormData when picking product color/size', async () => {
        const setOrderDetails = vi.fn();
        const setFormData = vi.fn();
        render(
            <EditOrderProduct
                orderDetails={[] as any}
                setOrderDetails={setOrderDetails}
                formData={defaultFormData as any}
                setFormData={setFormData}
            />
        );
        fireEvent.click(await screen.findByText('Product 1'));
        fireEvent.click(screen.getByText('Pick ColorSize'));
        await waitFor(() => {
            expect(setOrderDetails).toHaveBeenCalled();
            expect(setFormData).toHaveBeenCalled();
        });
    });

    it('shows error toast when increasing quantity beyond limit', () => {
        const orderDetails = [
            {
                itemId: 'cs1',
                product: {
                    id: 'p1',
                    name: 'Product 1',
                    price: 100,
                    cost: 80,
                    mainImageUrl: '',
                },
                unitPrice: 100,
                quantity: 5,
                color: { id: 'red', name: 'Red', code: '#ff0000' },
                size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
                productColorSizeId: 'cs1',
                productCost: 80,
                total: 500,
                limitedQuantity: 5,
            },
        ];
        render(
            <EditOrderProduct
                orderDetails={orderDetails as any}
                setOrderDetails={vi.fn()}
                formData={{ ...defaultFormData, productCost: 500, total: 500 } as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('+'));
        expect(toast.error).toHaveBeenCalledWith('limitedQuantity', expect.objectContaining({
            autoClose: 1000,
            position: 'top-right',
        }));
    });

    it('shows error toast when decreasing quantity below 1', () => {
        const orderDetails = [
            {
                itemId: 'cs1',
                product: {
                    id: 'p1',
                    name: 'Product 1',
                    price: 100,
                    cost: 80,
                    mainImageUrl: '',
                },
                unitPrice: 100,
                quantity: 1,
                color: { id: 'red', name: 'Red', code: '#ff0000' },
                size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
                productColorSizeId: 'cs1',
                productCost: 80,
                total: 100,
                limitedQuantity: 5,
            },
        ];
        render(
            <EditOrderProduct
                orderDetails={orderDetails as any}
                setOrderDetails={vi.fn()}
                formData={{ ...defaultFormData, productCost: 100, total: 100 } as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('-'));
        expect(toast.error).toHaveBeenCalledWith('quantityAtLeast', expect.objectContaining({
            autoClose: 1000,
            position: 'top-right',
        }));
    });

    it('shows error toast when entering quantity above limit', () => {
        const orderDetails = [
            {
                itemId: 'cs1',
                product: {
                    id: 'p1',
                    name: 'Product 1',
                    price: 100,
                    cost: 80,
                    mainImageUrl: '',
                },
                unitPrice: 100,
                quantity: 1,
                color: { id: 'red', name: 'Red', code: '#ff0000' },
                size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
                productColorSizeId: 'cs1',
                productCost: 80,
                total: 100,
                limitedQuantity: 5,
            },
        ];
        render(
            <EditOrderProduct
                orderDetails={orderDetails as any}
                setOrderDetails={vi.fn()}
                formData={{ ...defaultFormData, productCost: 100, total: 100 } as any}
                setFormData={vi.fn()}
            />
        );
        const input = screen.getByDisplayValue('1');
        fireEvent.change(input, { target: { value: '10' } });
        expect(toast.error).toHaveBeenCalledWith('limitedQuantity', expect.objectContaining({
            autoClose: 1000,
            position: 'top-right',
        }));
    });

    it('shows error toast when entering quantity below 1', () => {
        const orderDetails = [
            {
                itemId: 'cs1',
                product: {
                    id: 'p1',
                    name: 'Product 1',
                    price: 100,
                    cost: 80,
                    mainImageUrl: '',
                },
                unitPrice: 100,
                quantity: 1,
                color: { id: 'red', name: 'Red', code: '#ff0000' },
                size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
                productColorSizeId: 'cs1',
                productCost: 80,
                total: 100,
                limitedQuantity: 5,
            },
        ];
        render(
            <EditOrderProduct
                orderDetails={orderDetails as any}
                setOrderDetails={vi.fn()}
                formData={{ ...defaultFormData, productCost: 100, total: 100 } as any}
                setFormData={vi.fn()}
            />
        );
        const input = screen.getByDisplayValue('1');
        fireEvent.change(input, { target: { value: '0' } });
        expect(toast.error).toHaveBeenCalledWith('quantityAtLeast', expect.objectContaining({
            autoClose: 1000,
            position: 'top-right',
        }));
    });

    it('navigates to preview if next is clicked with products', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <EditOrderProduct
                orderDetails={[
                    {
                        itemId: 'cs1',
                        product: {
                            id: 'p1',
                            name: 'Product 1',
                            price: 100,
                            cost: 80,
                            mainImageUrl: '',
                        },
                        unitPrice: 100,
                        quantity: 1,
                        color: { id: 'red', name: 'Red', code: '#ff0000' },
                        size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
                        productColorSizeId: 'cs1',
                        productCost: 80,
                        total: 100,
                        limitedQuantity: 5,
                    },
                ] as any}
                setOrderDetails={vi.fn()}
                formData={{ ...defaultFormData, productCost: 100, total: 100 } as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('next'));
        expect(navigate).toHaveBeenCalledWith('/orders/edit/order-1/preview');
    });

    it('navigates back when back is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <EditOrderProduct
                orderDetails={[] as any}
                setOrderDetails={vi.fn()}
                formData={defaultFormData as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('back'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });
});