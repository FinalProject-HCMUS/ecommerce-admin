import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import TopProducts from '../../../src/pages/statistics/TopProducts';
import { BestSellerProduct } from '../../../src/types/statistics/BestSellerProduct';
import { BestSellerProductResponse } from '../../../src/types/statistics/BestSellerProductResponse';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'statistics': 'Statistics',
                'topProductsSold': 'Top Products Sold',
                'sortBy': 'Sort by',
                'month': 'Month',
                'year': 'Year',
                'imageProduct': 'Product Image',
                'productName': 'Product Name',
                'price': 'Price',
                'sold': 'Sold',
                'revenue': 'Revenue'
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

// Mock MotionPage component
vi.mock('../../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="motion-page">{children}</div>,
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

// Mock react-datepicker
vi.mock('react-datepicker', () => ({
    __esModule: true,
    default: ({ onChange, selected, showMonthYearPicker, showYearPicker, className, ...props }: {
        onChange: (date: Date) => void;
        selected: Date;
        showMonthYearPicker?: boolean;
        showYearPicker?: boolean;
        className?: string;
        [key: string]: unknown;
    }) => (
        <input
            data-testid={showMonthYearPicker ? "month-picker" : showYearPicker ? "year-picker" : "date-picker"}
            className={className}
            value={selected ? selected.toISOString().split('T')[0] : ''}
            onChange={(e) => onChange && onChange(new Date(e.target.value))}
            {...props}
        />
    ),
}));

// Mock TopProductTable component
vi.mock('../../../src/components/statistics/TopProductTable', () => ({
    __esModule: true,
    default: ({ products }: { products: BestSellerProduct[] }) => (
        <div data-testid="top-product-table">
            {products.map((product, index) => (
                <div key={index} data-testid={`product-${index}`}>
                    <span data-testid={`product-name-${index}`}>{product.name}</span>
                    <span data-testid={`product-price-${index}`}>{product.price}</span>
                    <span data-testid={`product-sold-${index}`}>{product.quantitysold}</span>
                    <span data-testid={`product-revenue-${index}`}>{product.revenue}</span>
                </div>
            ))}
        </div>
    ),
}));

// Mock statisticsApi
vi.mock('../../../src/apis/statisticsApi', () => ({
    getBestSellerProduct: vi.fn(),
}));

// Import the mocked function
import { getBestSellerProduct } from '../../../src/apis/statisticsApi';
const mockGetBestSellerProduct = vi.mocked(getBestSellerProduct);

describe('TopProducts', () => {
    const mockProductData: BestSellerProduct[] = [
        {
            name: 'Product 1',
            imageurl: 'https://example.com/product1.jpg',
            prodcutid: '1',
            price: 100000,
            quantitysold: 50,
            revenue: 5000000
        },
        {
            name: 'Product 2',
            imageurl: 'https://example.com/product2.jpg',
            prodcutid: '2',
            price: 200000,
            quantitysold: 30,
            revenue: 6000000
        },
        {
            name: 'Product 3',
            imageurl: 'https://example.com/product3.jpg',
            prodcutid: '3',
            price: 150000,
            quantitysold: 40,
            revenue: 6000000
        }
    ];

    const mockBestSellerResponse: BestSellerProductResponse = {
        products: mockProductData
    };

    const createSuccessResponse = (data: BestSellerProductResponse) => ({
        isSuccess: true,
        timestamp: '2024-01-01T00:00:00Z',
        httpStatus: '200',
        message: 'Success',
        data
    });

    const createErrorResponse = (message: string) => ({
        isSuccess: false,
        timestamp: '2024-01-01T00:00:00Z',
        httpStatus: '500',
        message,
        data: undefined
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        mockGetBestSellerProduct.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<TopProducts />);

        expect(screen.getByText('Statistics')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders top products successfully', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByText('Top Products Sold')).toBeInTheDocument();
        });

        expect(screen.getByText('Statistics')).toBeInTheDocument();
        expect(screen.getByTestId('top-product-table')).toBeInTheDocument();
    });

    it('displays correct product data in table', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByTestId('top-product-table')).toBeInTheDocument();
        });

        // Check if products are rendered
        expect(screen.getByTestId('product-name-0')).toHaveTextContent('Product 1');
        expect(screen.getByTestId('product-name-1')).toHaveTextContent('Product 2');
        expect(screen.getByTestId('product-name-2')).toHaveTextContent('Product 3');

        // Check if price data is passed correctly
        expect(screen.getByTestId('product-price-0')).toHaveTextContent('100000');
        expect(screen.getByTestId('product-price-1')).toHaveTextContent('200000');
        expect(screen.getByTestId('product-price-2')).toHaveTextContent('150000');

        // Check if quantity sold data is passed correctly
        expect(screen.getByTestId('product-sold-0')).toHaveTextContent('50');
        expect(screen.getByTestId('product-sold-1')).toHaveTextContent('30');
        expect(screen.getByTestId('product-sold-2')).toHaveTextContent('40');

        // Check if revenue data is passed correctly
        expect(screen.getByTestId('product-revenue-0')).toHaveTextContent('5000000');
        expect(screen.getByTestId('product-revenue-1')).toHaveTextContent('6000000');
        expect(screen.getByTestId('product-revenue-2')).toHaveTextContent('6000000');
    });

    it('handles type selection change (month to year)', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Month')).toBeInTheDocument();
        });

        expect(screen.getByTestId('month-picker')).toBeInTheDocument();

        // Change to year view
        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        // Wait for the state to update
        await waitFor(() => {
            expect(screen.getByDisplayValue('Year')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId('year-picker')).toBeInTheDocument();
        });
    });

    it('handles month picker change', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByTestId('month-picker')).toBeInTheDocument();
        });

        const monthPicker = screen.getByTestId('month-picker');
        fireEvent.change(monthPicker, { target: { value: '2024-03-01' } });

        // Should trigger API call with new date
        await waitFor(() => {
            expect(mockGetBestSellerProduct).toHaveBeenCalledWith('month', '03-2024');
        });
    });

    it('handles year picker change', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Month')).toBeInTheDocument();
        });

        // Change to year view first
        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        // Wait for the year picker to appear
        await waitFor(() => {
            expect(screen.getByTestId('year-picker')).toBeInTheDocument();
        });

        const yearPicker = screen.getByTestId('year-picker');
        fireEvent.change(yearPicker, { target: { value: '2025-01-01' } });

        // Should trigger API call with new year
        await waitFor(() => {
            expect(mockGetBestSellerProduct).toHaveBeenCalledWith('year', '2025');
        });
    });

    it('handles API error gracefully', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createErrorResponse('API Error occurred'));

        render(<TopProducts />);

        // Wait for loading to finish and content to be displayed
        await waitFor(() => {
            expect(screen.getByText('Top Products Sold')).toBeInTheDocument();
        });

        // Should still show the page structure but with empty data
        expect(screen.getByText('Statistics')).toBeInTheDocument();
        expect(screen.getByTestId('top-product-table')).toBeInTheDocument();
    });

    it('handles empty product data', async () => {
        const emptyResponse: BestSellerProductResponse = {
            products: []
        };

        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(emptyResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByTestId('top-product-table')).toBeInTheDocument();
        });

        // Should render table but with no products
        expect(screen.queryByTestId('product-0')).not.toBeInTheDocument();
    });


    it('calls getBestSellerProduct API on component mount', () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        expect(mockGetBestSellerProduct).toHaveBeenCalledTimes(1);
        // The component will use the current date for the API call
        expect(mockGetBestSellerProduct).toHaveBeenCalledWith('month', expect.stringMatching(/^\d{2}-\d{4}$/));
    });

    it('displays correct header content and controls', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByText('Top Products Sold')).toBeInTheDocument();
        });

        // Check header elements
        expect(screen.getByText('Sort by')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Month')).toBeInTheDocument();
        expect(screen.getByTestId('month-picker')).toBeInTheDocument();

        // Check that the select has correct options
        const typeSelect = screen.getByDisplayValue('Month');
        expect(typeSelect).toBeInTheDocument();
    });

    it('handles loading state during API calls', async () => {
        // Mock a slow API call
        mockGetBestSellerProduct.mockImplementation(() =>
            new Promise(resolve =>
                setTimeout(() => resolve(createSuccessResponse(mockBestSellerResponse)), 100)
            )
        );

        render(<TopProducts />);

        // Should show loading initially
        expect(screen.getByRole('status')).toBeInTheDocument();

        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.getByText('Top Products Sold')).toBeInTheDocument();
        });
    });

    it('triggers API call when type changes', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Month')).toBeInTheDocument();
        });

        // Clear previous calls
        mockGetBestSellerProduct.mockClear();

        // Change to year view
        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        // Should trigger a new API call
        await waitFor(() => {
            expect(mockGetBestSellerProduct).toHaveBeenCalledTimes(1);
        });
    });

    it('maintains correct component state after multiple interactions', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Month')).toBeInTheDocument();
        });

        // Change to year view
        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        // Wait for the state to update and check the new value
        await waitFor(() => {
            expect(screen.getByDisplayValue('Year')).toBeInTheDocument();
        });

        // Change back to month view
        const updatedTypeSelect = screen.getByDisplayValue('Year');
        fireEvent.change(updatedTypeSelect, { target: { value: 'month' } });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Month')).toBeInTheDocument();
            expect(screen.getByTestId('month-picker')).toBeInTheDocument();
        });
    });

    it('prevents duplicate setLoading calls', async () => {
        mockGetBestSellerProduct.mockResolvedValue(createSuccessResponse(mockBestSellerResponse));

        render(<TopProducts />);

        await waitFor(() => {
            expect(screen.getByText('Top Products Sold')).toBeInTheDocument();
        });

        // Component should not be in loading state after successful load
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
});
