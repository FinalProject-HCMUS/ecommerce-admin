import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import TopProductTable from '../../../src/components/statistics/TopProductTable';
import { BestSellerProduct } from '../../../src/types/statistics/BestSellerProduct';

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

// Mock i18n for currency utility
vi.mock('../../../src/config/i18n', () => ({
    default: {
        language: 'en'
    }
}));

describe('TopProductTable', () => {
    const mockProducts: BestSellerProduct[] = [
        {
            prodcutid: '1',
            name: 'Product A',
            imageurl: 'https://example.com/product-a.jpg',
            price: 150000,
            quantitysold: 25,
            revenue: 3750000
        },
        {
            prodcutid: '2',
            name: 'Product B',
            imageurl: 'https://example.com/product-b.jpg',
            price: 200000,
            quantitysold: 15,
            revenue: 3000000
        },
        {
            prodcutid: '3',
            name: 'Product C',
            imageurl: 'https://example.com/product-c.jpg',
            price: 99000,
            quantitysold: 50,
            revenue: 4950000
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders table headers correctly', () => {
        render(<TopProductTable products={mockProducts} />);

        expect(screen.getByText('imageProduct')).toBeInTheDocument();
        expect(screen.getByText('productName')).toBeInTheDocument();
        expect(screen.getByText('price')).toBeInTheDocument();
        expect(screen.getByText('sold')).toBeInTheDocument();
        expect(screen.getByText('revenue')).toBeInTheDocument();
    });

    it('renders product data correctly', () => {
        render(<TopProductTable products={mockProducts} />);

        // Check product names
        expect(screen.getByText('Product A')).toBeInTheDocument();
        expect(screen.getByText('Product B')).toBeInTheDocument();
        expect(screen.getByText('Product C')).toBeInTheDocument();

        // Check quantities sold
        expect(screen.getByText('25')).toBeInTheDocument();
        expect(screen.getByText('15')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('renders product images with correct attributes', () => {
        render(<TopProductTable products={mockProducts} />);

        const productAImage = screen.getByAltText('Product A');
        const productBImage = screen.getByAltText('Product B');
        const productCImage = screen.getByAltText('Product C');

        expect(productAImage).toBeInTheDocument();
        expect(productAImage).toHaveAttribute('src', 'https://example.com/product-a.jpg');
        expect(productBImage).toBeInTheDocument();
        expect(productBImage).toHaveAttribute('src', 'https://example.com/product-b.jpg');
        expect(productCImage).toBeInTheDocument();
        expect(productCImage).toHaveAttribute('src', 'https://example.com/product-c.jpg');
    });

    it('formats prices using formatProductCost', () => {
        render(<TopProductTable products={mockProducts} />);

        // Check that prices are formatted correctly
        expect(screen.getByText('$150000.00')).toBeInTheDocument();
        expect(screen.getByText('$200000.00')).toBeInTheDocument();
        expect(screen.getByText('$99000.00')).toBeInTheDocument();
    });

    it('formats revenue using formatProductCost', () => {
        render(<TopProductTable products={mockProducts} />);

        // Check that revenue is formatted correctly
        expect(screen.getByText('$3750000.00')).toBeInTheDocument();
        expect(screen.getByText('$3000000.00')).toBeInTheDocument();
        expect(screen.getByText('$4950000.00')).toBeInTheDocument();
    });

    it('renders empty table when no products provided', () => {
        render(<TopProductTable products={[]} />);

        // Headers should still be present
        expect(screen.getByText('imageProduct')).toBeInTheDocument();
        expect(screen.getByText('productName')).toBeInTheDocument();
        expect(screen.getByText('price')).toBeInTheDocument();
        expect(screen.getByText('sold')).toBeInTheDocument();
        expect(screen.getByText('revenue')).toBeInTheDocument();

        // But no product data should be present
        expect(screen.queryByText('Product A')).not.toBeInTheDocument();
    });

    it('renders table with proper structure and classes', () => {
        render(<TopProductTable products={mockProducts} />);

        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();
        expect(table).toHaveClass('min-w-full', 'divide-y', 'divide-gray-200');

        // Check for thead specifically
        const thead = table.querySelector('thead');
        expect(thead).toBeInTheDocument();
        expect(thead).toHaveClass('bg-gray-50');

        // Check for tbody
        const tbody = table.querySelector('tbody');
        expect(tbody).toBeInTheDocument();
    });

    it('handles single product correctly', () => {
        const singleProduct: BestSellerProduct[] = [
            {
                prodcutid: '1',
                name: 'Single Product',
                imageurl: 'https://example.com/single.jpg',
                price: 75000,
                quantitysold: 10,
                revenue: 750000
            }
        ];

        render(<TopProductTable products={singleProduct} />);

        expect(screen.getByText('Single Product')).toBeInTheDocument();
        expect(screen.getByText('$75000.00')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('$750000.00')).toBeInTheDocument();
    });

    it('handles products with zero values', () => {
        const zeroProducts: BestSellerProduct[] = [
            {
                prodcutid: '1',
                name: 'Zero Product',
                imageurl: 'https://example.com/zero.jpg',
                price: 0,
                quantitysold: 0,
                revenue: 0
            }
        ];

        render(<TopProductTable products={zeroProducts} />);

        expect(screen.getByText('Zero Product')).toBeInTheDocument();
        // Check that there are multiple $0.00 values (price and revenue)
        expect(screen.getAllByText('$0.00')).toHaveLength(2);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('displays correct values in table cells', () => {
        const testProduct: BestSellerProduct[] = [
            {
                prodcutid: '1',
                name: 'Test Product',
                imageurl: 'https://example.com/test.jpg',
                price: 100000,
                quantitysold: 5,
                revenue: 500000
            }
        ];

        render(<TopProductTable products={testProduct} />);

        // Find the table body
        const table = screen.getByRole('table');
        const tbody = table.querySelector('tbody');
        expect(tbody).toBeInTheDocument();

        // Check specific cells
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$100000.00')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('$500000.00')).toBeInTheDocument();
    });
});
