import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import ProductPickerDialog from '../../../src/components/product/ProductPickerDialog';
import { Product } from '../../../src/types/product/Product';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'product': 'Product',
                'category': 'Category',
                'cost': 'Cost',
                'price': 'Price',
                'action': 'Action'
            };
            return translations[key] || key;
        },
        i18n: {
            language: 'en'
        }
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { }
    }
}));

// Mock currency utility
vi.mock('../../../src/utils/currency', () => ({
    formatProductCost: vi.fn((value: number) => `$${value.toFixed(2)}`)
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
    MousePointer2: ({ size, ...props }: { size?: number;[key: string]: unknown }) => (
        <svg
            data-testid="mouse-pointer-icon"
            width={size}
            height={size}
            {...props}
        >
            <path d="M3 3l18 7-4 3-7 4z" />
        </svg>
    ),
}));

// Mock environment variable
vi.mock('import.meta', () => ({
    env: {
        VITE_VND_TO_USD: 0.000043
    }
}), { virtual: true });

// Import mocked functions
import { formatProductCost } from '../../../src/utils/currency';
const mockFormatProductCost = vi.mocked(formatProductCost);

describe('ProductPickerDialog', () => {
    const mockOnProductSelect = vi.fn();

    const mockProduct1: Product = {
        id: 'product-1',
        name: 'Test Product 1',
        description: 'This is a test product description',
        cost: 100.50,
        total: 10,
        price: 200.00,
        discountPercent: 10,
        enable: true,
        inStock: true,
        mainImageUrl: 'https://example.com/product1.jpg',
        categoryId: 'category-1',
        categoryName: 'Electronics'
    };

    const mockProduct2: Product = {
        id: 'product-2',
        name: 'Test Product 2',
        description: 'Another test product',
        cost: 75.25,
        total: 5,
        price: 150.00,
        discountPercent: 5,
        enable: true,
        inStock: false,
        mainImageUrl: 'https://example.com/product2.jpg',
        categoryId: 'category-2',
        categoryName: 'Clothing'
    };

    const mockProduct3: Product = {
        id: 'product-3',
        name: 'Very Long Product Name That Might Overflow The Container',
        description: 'Product with a very long name to test layout',
        cost: 50.00,
        total: 20,
        price: 99.99,
        discountPercent: 0,
        enable: false,
        inStock: true,
        mainImageUrl: 'https://example.com/product3.jpg',
        categoryId: 'category-3',
        categoryName: 'Books & Media'
    };

    const defaultProps = {
        products: [mockProduct1, mockProduct2, mockProduct3],
        onProductSelect: mockOnProductSelect
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockFormatProductCost.mockImplementation((value: number) => `$${value.toFixed(2)}`);
    });

    it('renders product table with correct headers', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        expect(screen.getByText('Product')).toBeInTheDocument();
        expect(screen.getByText('Category')).toBeInTheDocument();
        expect(screen.getByText('Cost')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('displays all products in the table', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
        expect(screen.getByText('Very Long Product Name That Might Overflow The Container')).toBeInTheDocument();

        expect(screen.getByText('Electronics')).toBeInTheDocument();
        expect(screen.getByText('Clothing')).toBeInTheDocument();
        expect(screen.getByText('Books & Media')).toBeInTheDocument();
    });

    it('displays product images with correct attributes', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(3);

        expect(images[0]).toHaveAttribute('src', 'https://example.com/product1.jpg');
        expect(images[0]).toHaveAttribute('alt', 'Test Product 1');
        expect(images[0]).toHaveClass('h-full', 'w-full', 'rounded-lg', 'object-contain');

        expect(images[1]).toHaveAttribute('src', 'https://example.com/product2.jpg');
        expect(images[1]).toHaveAttribute('alt', 'Test Product 2');

        expect(images[2]).toHaveAttribute('src', 'https://example.com/product3.jpg');
        expect(images[2]).toHaveAttribute('alt', 'Very Long Product Name That Might Overflow The Container');
    });

    it('formats and displays product costs and prices correctly', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        expect(mockFormatProductCost).toHaveBeenCalledWith(200.00);
        expect(mockFormatProductCost).toHaveBeenCalledWith(100.50);
        expect(mockFormatProductCost).toHaveBeenCalledWith(150.00);
        expect(mockFormatProductCost).toHaveBeenCalledWith(75.25);
        expect(mockFormatProductCost).toHaveBeenCalledWith(99.99);
        expect(mockFormatProductCost).toHaveBeenCalledWith(50.00);

        // Check that formatted values are displayed
        expect(screen.getAllByText('$100.50')).toHaveLength(1);
        expect(screen.getAllByText('$200.00')).toHaveLength(1);
        expect(screen.getAllByText('$75.25')).toHaveLength(1);
        expect(screen.getAllByText('$150.00')).toHaveLength(1);
        expect(screen.getAllByText('$50.00')).toHaveLength(1);
        expect(screen.getAllByText('$99.99')).toHaveLength(1);
    });

    it('displays action buttons with correct icons', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const actionButtons = screen.getAllByRole('button');
        expect(actionButtons).toHaveLength(3);

        const icons = screen.getAllByTestId('mouse-pointer-icon');
        expect(icons).toHaveLength(3);

        icons.forEach(icon => {
            expect(icon).toHaveAttribute('width', '20');
            expect(icon).toHaveAttribute('height', '20');
        });
    });

    it('calls onProductSelect when action button is clicked', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const actionButtons = screen.getAllByRole('button');

        fireEvent.click(actionButtons[0]);
        expect(mockOnProductSelect).toHaveBeenCalledTimes(1);
        expect(mockOnProductSelect).toHaveBeenCalledWith(mockProduct1);

        fireEvent.click(actionButtons[1]);
        expect(mockOnProductSelect).toHaveBeenCalledTimes(2);
        expect(mockOnProductSelect).toHaveBeenCalledWith(mockProduct2);

        fireEvent.click(actionButtons[2]);
        expect(mockOnProductSelect).toHaveBeenCalledTimes(3);
        expect(mockOnProductSelect).toHaveBeenCalledWith(mockProduct3);
    });

    it('has correct table styling and structure', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const tableContainer = screen.getByRole('table').closest('div');
        expect(tableContainer).toHaveClass(
            'overflow-x-auto',
            'border',
            'border-gray-300',
            'rounded-lg',
            'shadow-md'
        );

        const table = screen.getByRole('table');
        expect(table).toHaveClass('min-w-full', 'divide-y', 'divide-gray-200');

        const thead = screen.getByRole('columnheader', { name: 'Product' }).closest('thead');
        expect(thead).toHaveClass('bg-gray-50');

        const tbody = screen.getByText('Test Product 1').closest('tbody');
        expect(tbody).toHaveClass('bg-white', 'divide-y', 'divide-gray-200');
    });

    it('applies correct styling to table headers', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const headers = screen.getAllByRole('columnheader');
        headers.forEach(header => {
            expect(header).toHaveClass(
                'px-6',
                'py-3',
                'text-left',
                'text-xs',
                'font-medium',
                'text-gray-500',
                'uppercase',
                'tracking-wider'
            );
        });
    });

    it('applies correct styling to action buttons', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const actionButtons = screen.getAllByRole('button');
        actionButtons.forEach(button => {
            expect(button).toHaveClass('text-blue-600', 'hover:text-blue-900');
        });
    });

    it('renders empty table when no products provided', () => {
        const emptyProps = {
            products: [],
            onProductSelect: mockOnProductSelect
        };

        render(<ProductPickerDialog {...emptyProps} />);

        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getByText('Product')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('handles products with missing image URLs gracefully', () => {
        const productWithoutImage = {
            ...mockProduct1,
            mainImageUrl: ''
        };

        const propsWithEmptyImage = {
            products: [productWithoutImage],
            onProductSelect: mockOnProductSelect
        };

        render(<ProductPickerDialog {...propsWithEmptyImage} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', '');
        expect(image).toHaveAttribute('alt', 'Test Product 1');
    });

    it('displays product names in correct typography', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const productNames = screen.getAllByText(/Test Product|Very Long Product/);
        productNames.forEach(name => {
            expect(name).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
        });
    });

    it('displays category names with correct styling', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const categoryElements = [
            screen.getByText('Electronics'),
            screen.getByText('Clothing'),
            screen.getByText('Books & Media')
        ];

        categoryElements.forEach(category => {
            expect(category).toHaveClass('text-sm', 'text-gray-900');
        });
    });

    it('displays cost and price values with correct styling', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const priceElements = screen.getAllByText(/\$\d+\.\d{2}/);
        priceElements.forEach(price => {
            expect(price).toHaveClass('text-sm', 'text-gray-900');
        });
    });

    it('handles products with zero cost or price', () => {
        const productWithZeroValues = {
            ...mockProduct1,
            cost: 0,
            price: 0
        };

        const propsWithZeroValues = {
            products: [productWithZeroValues],
            onProductSelect: mockOnProductSelect
        };

        render(<ProductPickerDialog {...propsWithZeroValues} />);

        expect(mockFormatProductCost).toHaveBeenCalledWith(0);
        expect(mockFormatProductCost).toHaveBeenCalledTimes(2); // Called for both price and cost
        expect(screen.getAllByText('$0.00')).toHaveLength(2); // Both cost and price show $0.00
    });

    it('maintains consistent row height with image containers', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const imageContainers = screen.getAllByRole('img').map(img => img.parentElement);
        imageContainers.forEach(container => {
            expect(container).toHaveClass('h-16', 'w-16', 'flex-shrink-0');
        });
    });

    it('arranges product information correctly within cells', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        // Check that product name and image are in the same cell structure
        const productCells = screen.getAllByText(/Test Product|Very Long Product/).map(
            text => text.closest('td')
        );

        productCells.forEach(cell => {
            const flexContainer = cell?.querySelector('.flex.items-center');
            expect(flexContainer).toBeInTheDocument();

            const imageContainer = flexContainer?.querySelector('.h-16.w-16');
            const textContainer = flexContainer?.querySelector('.ml-4');

            expect(imageContainer).toBeInTheDocument();
            expect(textContainer).toBeInTheDocument();
        });
    });

    it('handles long product names without breaking layout', () => {
        render(<ProductPickerDialog {...defaultProps} />);

        const longNameElement = screen.getByText('Very Long Product Name That Might Overflow The Container');
        expect(longNameElement).toBeInTheDocument();
        expect(longNameElement).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
    });
});
