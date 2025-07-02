import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import { vi } from 'vitest';
import Products from '../../../src/pages/product/Products';

// Mocks
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
vi.mock('../../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../../src/components/common/Pagination', () => ({
    __esModule: true,
    default: ({ currentPage, totalPages, onPageChange }: any) => (
        <div data-testid="pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
    ),
}));
vi.mock('../../../src/components/product/ProductTable', () => ({
    __esModule: true,
    default: ({ products }: any) => (
        <div data-testid="product-table">
            {products.map((product: any) => (
                <div key={product.id}>
                    <span>{product.name}</span>
                </div>
            ))}
        </div>
    ),
}));
vi.mock('../../../src/apis/productApi', () => ({
    getProducts: vi.fn(),
}));
vi.mock('../../../src/apis/categoryApi', () => ({
    getAllCategories: vi.fn(),
}));
vi.mock('../../../src/apis/sizeApi', () => ({
    getSizes: vi.fn(),
}));
vi.mock('../../../src/apis/colorApi', () => ({
    getColors: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

// Mock currency utilities
vi.mock('../../../src/utils/currency', () => ({
    formatPrice: (amount: number) => `₫${amount.toLocaleString()}`,
}));

// Mock i18n for currency utility
vi.mock('../../../src/config/i18n', () => ({
    default: {
        language: 'vi'
    }
}));

import { getProducts } from '../../../src/apis/productApi';
import { getAllCategories } from '../../../src/apis/categoryApi';
import { getSizes } from '../../../src/apis/sizeApi';
import { getColors } from '../../../src/apis/colorApi';
import { toast } from 'react-toastify';

describe('Products page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (getAllCategories as any).mockResolvedValue({ isSuccess: true, data: [] });
        (getSizes as any).mockResolvedValue({ isSuccess: true, data: { content: [] } });
        (getColors as any).mockResolvedValue({ isSuccess: true, data: { content: [] } });
    });

    it('renders product list and pagination', async () => {
        (getProducts as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', name: 'Product 1' },
                    { id: '2', name: 'Product 2' },
                ],
                totalPages: 2,
            },
        });
        render(<Products />);
        expect(await screen.findByText('products')).toBeInTheDocument();
        expect(await screen.findByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('shows loading spinner while loading', async () => {
        let resolve: any;
        (getProducts as any).mockImplementation(
            () => new Promise(res => { resolve = res; })
        );
        render(<Products />);
        expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
        resolve({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        await waitFor(() => {
            expect(screen.getByTestId('product-table')).toBeInTheDocument();
        });
    });

    it('shows error toast if getProducts fails', async () => {
        (getProducts as any).mockResolvedValue({
            isSuccess: false,
            message: 'fail',
        });
        render(<Products />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to add product page on add button click', async () => {
        (getProducts as any).mockResolvedValue({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        render(<Products />);
        const addBtn = await screen.findByText('addProduct');
        fireEvent.click(addBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/products/add/information');
    });

    it('searches when pressing Enter in search input', async () => {
        (getProducts as any).mockResolvedValue({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        render(<Products />);
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await waitFor(() => {
            expect(getProducts).toHaveBeenCalled();
        });
    });

    it('changes page when clicking pagination', async () => {
        (getProducts as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', name: 'Product 1' },
                ],
                totalPages: 2,
            },
        });
        render(<Products />);
        await screen.findByText('Product 1');
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn);
        await waitFor(() => {
            expect(getProducts).toHaveBeenCalled();
        });
    });
});