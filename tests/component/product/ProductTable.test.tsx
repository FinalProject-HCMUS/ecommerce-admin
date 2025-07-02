import { render, screen, fireEvent } from '@testing-library/react';
import ProductTable from '../../../src/components/product/ProductTable';
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

const products = [
    {
        id: '1',
        name: 'Product 1',
        mainImageUrl: 'https://example.com/img1.jpg',
        categoryName: 'Category A',
        price: 1000,
        total: 10,
        inStock: true,
        enable: true,
        description: 'Description for Product 1',
        cost: 800,
        discountPercent: 10,
        categoryId: 'catA',
    },
    {
        id: '2',
        name: 'Product 2',
        mainImageUrl: 'https://example.com/img2.jpg',
        categoryName: 'Category B',
        price: 2000,
        total: 0,
        inStock: false,
        enable: false,
        description: 'Description for Product 2',
        cost: 1500,
        discountPercent: 0,
        categoryId: 'catB',
    },
];

describe('ProductTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders product names, categories, prices, stock, and status', () => {
        render(
            <MemoryRouter>
                <ProductTable products={products} />
            </MemoryRouter>
        );
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('Category A')).toBeInTheDocument();
        expect(screen.getByText('Category B')).toBeInTheDocument();
        expect(screen.getByText('1,000')).toBeInTheDocument();
        expect(screen.getByText('2,000')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('In Stock')).toBeInTheDocument();
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
        expect(screen.getByText('Enabled')).toBeInTheDocument();
        expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('renders product images', () => {
        render(
            <MemoryRouter>
                <ProductTable products={products} />
            </MemoryRouter>
        );
        expect(screen.getByAltText('Product 1')).toHaveAttribute('src', 'https://example.com/img1.jpg');
        expect(screen.getByAltText('Product 2')).toHaveAttribute('src', 'https://example.com/img2.jpg');
    });

    it('navigates to edit page on edit button click', async () => {
        const navigate = vi.fn();
        const routerDom = await import('react-router-dom');
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <MemoryRouter>
                <ProductTable products={products} />
            </MemoryRouter>
        );
        const editButtons = screen.getAllByRole('button');
        fireEvent.click(editButtons[0]);
        expect(navigate).toHaveBeenCalledWith('/products/edit/1/information');
        fireEvent.click(editButtons[1]);
        expect(navigate).toHaveBeenCalledWith('/products/edit/2/information');
    });

    it('renders empty state if no products', () => {
        render(
            <MemoryRouter>
                <ProductTable products={[]} />
            </MemoryRouter>
        );
        expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
    });
});