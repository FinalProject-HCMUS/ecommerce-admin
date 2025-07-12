import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddOrderProduct from '../../../../../src/components/page/order/add-page/AddOrderProduct';
import React from 'react';
import { vi } from 'vitest';

// Mocks
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));
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
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));
vi.mock('../../../../../src/utils/currency', () => ({
    formatProductCost: (amount: number) => {
        // Match the actual formatting used in the component
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(1)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(1)}K`;
        }
        return `$${amount.toFixed(2)}`;
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

describe('AddOrderProduct', () => {
    const defaultOrderDetails = [];
    const defaultFormData = {
        productCost: 0,
        shippingCost: 0,
        total: 0,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders product picker and order summary', async () => {
        render(
            <AddOrderProduct
                orderDetails={defaultOrderDetails}
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
            <AddOrderProduct
                orderDetails={[]}
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

    it('shows error toast if next is clicked with no products', () => {
        render(
            <AddOrderProduct
                orderDetails={[]}
                setOrderDetails={vi.fn()}
                formData={defaultFormData as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('next'));
        expect(toast.error).toHaveBeenCalledWith('orderMustHaveProduct', expect.objectContaining({
            autoClose: 1000,
            position: 'top-right',
        }));
    });

    it('navigates to preview if next is clicked with products', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <AddOrderProduct
                orderDetails={[
                    {
                        itemId: 'cs1',
                        product: {
                            id: 'p1',
                            name: 'Product 1',
                            price: 100,
                            cost: 80,
                            mainImageUrl: '',
                            description: '',
                            total: 0,
                            discountPercent: 0,
                            enable: true,
                            categoryId: 'cat1',
                            inStock: true,
                            categoryName: 'Category 1',
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
                ]}
                setOrderDetails={vi.fn()}
                formData={{ ...defaultFormData, productCost: 100, total: 100 } as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('next'));
        expect(navigate).toHaveBeenCalledWith('/orders/add/preview');
    });

    it('navigates back when back is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <AddOrderProduct
                orderDetails={[]}
                setOrderDetails={vi.fn()}
                formData={defaultFormData as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('back'));
        expect(navigate).toHaveBeenCalledWith(-1);
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
                    description: '',
                    total: 0,
                    discountPercent: 0,
                    enable: true,
                    categoryId: 'cat1',
                    inStock: true,
                    categoryName: 'Category 1',
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
            <AddOrderProduct
                orderDetails={orderDetails}
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
                    description: '',
                    total: 0,
                    discountPercent: 0,
                    enable: true,
                    categoryId: 'cat1',
                    inStock: true,
                    categoryName: 'Category 1',
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
            <AddOrderProduct
                orderDetails={orderDetails}
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
        const setOrderDetails = vi.fn();
        const setFormData = vi.fn();
        const orderDetails = [
            {
                itemId: 'cs1',
                product: {
                    id: 'p1',
                    name: 'Product 1',
                    price: 100,
                    cost: 80,
                    mainImageUrl: '',
                    description: '',
                    total: 0,
                    discountPercent: 0,
                    enable: true,
                    categoryId: 'cat1',
                    inStock: true,
                    categoryName: 'Category 1',
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
            <AddOrderProduct
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
                formData={{ ...defaultFormData, productCost: 100, total: 100 } as any}
                setFormData={setFormData}
            />
        );
        const input = screen.getByDisplayValue('1');
        fireEvent.change(input, { target: { value: '10' } });
        expect(toast.error).toHaveBeenCalledWith('limitedQuantity', expect.objectContaining({
            autoClose: 1000,
            position: 'top-right',
        }));
    });

    it('handles quantity input changes with local state', () => {
        const setOrderDetails = vi.fn();
        const setFormData = vi.fn();
        const orderDetails = [
            {
                itemId: 'cs1',
                product: {
                    id: 'p1',
                    name: 'Product 1',
                    price: 100,
                    cost: 80,
                    mainImageUrl: '',
                    description: '',
                    total: 0,
                    discountPercent: 0,
                    enable: true,
                    categoryId: 'cat1',
                    inStock: true,
                    categoryName: 'Category 1',
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
            <AddOrderProduct
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
                formData={{ ...defaultFormData, productCost: 100, total: 100 } as any}
                setFormData={setFormData}
            />
        );

        const input = screen.getByDisplayValue('1');

        // Test valid input change
        fireEvent.change(input, { target: { value: '3' } });
        expect(setOrderDetails).toHaveBeenCalled();
        expect(setFormData).toHaveBeenCalled();

        // Test empty input (should not trigger handlers)
        vi.clearAllMocks();
        fireEvent.change(input, { target: { value: '' } });
        expect(setOrderDetails).not.toHaveBeenCalled();
        expect(setFormData).not.toHaveBeenCalled();
    });

    it('resets input value on blur when invalid', () => {
        const orderDetails = [
            {
                itemId: 'cs1',
                product: {
                    id: 'p1',
                    name: 'Product 1',
                    price: 100,
                    cost: 80,
                    mainImageUrl: '',
                    description: '',
                    total: 0,
                    discountPercent: 0,
                    enable: true,
                    categoryId: 'cat1',
                    inStock: true,
                    categoryName: 'Category 1',
                },
                unitPrice: 100,
                quantity: 2,
                color: { id: 'red', name: 'Red', code: '#ff0000' },
                size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
                productColorSizeId: 'cs1',
                productCost: 80,
                total: 200,
                limitedQuantity: 5,
            },
        ];
        render(
            <AddOrderProduct
                orderDetails={orderDetails}
                setOrderDetails={vi.fn()}
                formData={{ ...defaultFormData, productCost: 200, total: 200 } as any}
                setFormData={vi.fn()}
            />
        );

        const input = screen.getByDisplayValue('2');

        // Focus the input first
        fireEvent.focus(input);

        // Change to empty value
        fireEvent.change(input, { target: { value: '' } });

        // Blur should reset to original value
        fireEvent.blur(input);
        expect(input).toHaveValue(2);
    });

    it('updates quantity inputs state when using +/- buttons', () => {
        const setOrderDetails = vi.fn();
        const setFormData = vi.fn();
        const orderDetails = [
            {
                itemId: 'cs1',
                product: {
                    id: 'p1',
                    name: 'Product 1',
                    price: 100,
                    cost: 80,
                    mainImageUrl: '',
                    description: '',
                    total: 0,
                    discountPercent: 0,
                    enable: true,
                    categoryId: 'cat1',
                    inStock: true,
                    categoryName: 'Category 1',
                },
                unitPrice: 100,
                quantity: 2,
                color: { id: 'red', name: 'Red', code: '#ff0000' },
                size: { id: 'size-l', name: 'L', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
                productColorSizeId: 'cs1',
                productCost: 80,
                total: 200,
                limitedQuantity: 5,
            },
        ];
        render(
            <AddOrderProduct
                orderDetails={orderDetails}
                setOrderDetails={setOrderDetails}
                formData={{ ...defaultFormData, productCost: 200, total: 200 } as any}
                setFormData={setFormData}
            />
        );

        // Test increase button
        fireEvent.click(screen.getByText('+'));
        expect(setOrderDetails).toHaveBeenCalled();
        expect(setFormData).toHaveBeenCalled();

        // Test decrease button  
        fireEvent.click(screen.getByText('-'));
        expect(setOrderDetails).toHaveBeenCalled();
        expect(setFormData).toHaveBeenCalled();
    });
});