import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import ProductCategories from '../../../src/pages/statistics/ProductCategories';
import { ProductCategoryResponse } from '../../../src/types/statistics/ProductCategoryResponse';

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

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) => <div {...props}>{children}</div>,
    },
}));

// Mock Chart.js and react-chartjs-2
vi.mock('chart.js', () => ({
    Chart: {
        register: vi.fn(),
    },
    CategoryScale: vi.fn(),
    LinearScale: vi.fn(),
    PointElement: vi.fn(),
    LineElement: vi.fn(),
    Title: vi.fn(),
    Tooltip: vi.fn(),
    Legend: vi.fn(),
    ArcElement: vi.fn(),
}));

vi.mock('react-chartjs-2', () => ({
    Doughnut: ({ data, options }: { data: unknown; options: unknown }) => (
        <div data-testid="doughnut-chart" data-chart-data={JSON.stringify(data)} data-chart-options={JSON.stringify(options)}>
            Mock Doughnut Chart
        </div>
    ),
}));

// Mock statisticsApi
vi.mock('../../../src/apis/statisticsApi', () => ({
    getProductCategories: vi.fn(),
}));

// Import the mocked function
import { getProductCategories } from '../../../src/apis/statisticsApi';
const mockGetProductCategories = vi.mocked(getProductCategories);

describe('ProductCategories', () => {
    const mockProductCategoryData: ProductCategoryResponse = {
        categories: ['Electronics', 'Clothing', 'Books', 'Home & Garden'],
        data: [25, 35, 20, 15]
    };

    const createSuccessResponse = (data: ProductCategoryResponse) => ({
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
        mockGetProductCategories.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<ProductCategories />);

        expect(screen.getByText('statistics')).toBeInTheDocument();
        expect(screen.getByText('productCategory')).toBeInTheDocument();

        // Should show loading spinner
        const loadingSpinner = screen.getByRole('status');
        expect(loadingSpinner).toBeInTheDocument();
        expect(loadingSpinner).toHaveClass('flex', 'justify-center', 'items-center', 'h-[400px]');
    });

    it('renders product categories successfully', async () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        expect(screen.getByText('statistics')).toBeInTheDocument();
        expect(screen.getByText('productCategory')).toBeInTheDocument();
        expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();
    });

    it('displays correct category labels and data', async () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        // Check that all categories are displayed
        expect(screen.getByText('Electronics')).toBeInTheDocument();
        expect(screen.getByText('Clothing')).toBeInTheDocument();
        expect(screen.getByText('Books')).toBeInTheDocument();
        expect(screen.getByText('Home & Garden')).toBeInTheDocument();

        // Check that values and percentages are displayed correctly
        expect(screen.getByText('25 (26.3%)')).toBeInTheDocument(); // Electronics: 25/(25+35+20+15) = 26.3%
        expect(screen.getByText('35 (36.8%)')).toBeInTheDocument(); // Clothing: 35/95 = 36.8%
        expect(screen.getByText('20 (21.1%)')).toBeInTheDocument(); // Books: 20/95 = 21.1%
        expect(screen.getByText('15 (15.8%)')).toBeInTheDocument(); // Home & Garden: 15/95 = 15.8%
    });

    it('calculates and displays total products correctly', async () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        // Total should be 25 + 35 + 20 + 15 = 95
        expect(screen.getByText('95')).toBeInTheDocument();
        expect(screen.getByText('totalProducts:')).toBeInTheDocument();
    });

    it('passes correct data to Doughnut chart', async () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        const chartElement = screen.getByTestId('doughnut-chart');
        const chartData = JSON.parse(chartElement.getAttribute('data-chart-data') || '{}');

        expect(chartData.labels).toEqual(['Electronics', 'Clothing', 'Books', 'Home & Garden']);
        expect(chartData.datasets[0].data).toEqual([25, 35, 20, 15]);
        expect(chartData.datasets[0].borderWidth).toBe(2);
    });

    it('generates correct colors for chart', async () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        const chartElement = screen.getByTestId('doughnut-chart');
        const chartData = JSON.parse(chartElement.getAttribute('data-chart-data') || '{}');

        // Should have background colors and hover colors for each category
        expect(chartData.datasets[0].backgroundColor).toHaveLength(4);
        expect(chartData.datasets[0].hoverBackgroundColor).toHaveLength(4);

        // Check that colors are HSL format
        chartData.datasets[0].backgroundColor.forEach((color: string) => {
            expect(color).toMatch(/^hsl\(\d+, 70%, 55%\)$/);
        });
        chartData.datasets[0].hoverBackgroundColor.forEach((color: string) => {
            expect(color).toMatch(/^hsl\(\d+, 70%, 40%\)$/);
        });
    });

    it('handles API error gracefully', async () => {
        mockGetProductCategories.mockResolvedValue(createErrorResponse('API Error occurred'));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        // Should still show the page structure but without data
        expect(screen.getByText('statistics')).toBeInTheDocument();
        expect(screen.getByText('productCategory')).toBeInTheDocument();
    });

    it('handles empty categories data', async () => {
        const emptyData: ProductCategoryResponse = {
            categories: [],
            data: []
        };

        mockGetProductCategories.mockResolvedValue(createSuccessResponse(emptyData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        expect(screen.getByText('0')).toBeInTheDocument(); // Total products should be 0
        expect(screen.getByTestId('doughnut-chart')).toBeInTheDocument();

        const chartElement = screen.getByTestId('doughnut-chart');
        const chartData = JSON.parse(chartElement.getAttribute('data-chart-data') || '{}');
        expect(chartData.labels).toEqual([]);
        expect(chartData.datasets[0].data).toEqual([]);
    });

    it('renders with proper page structure', async () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('motion-page')).toBeInTheDocument();

        // Check for proper CSS classes and structure
        const mainContainer = screen.getByText('statistics').closest('div');
        expect(mainContainer).toHaveClass('p-8', 'bg-gray-100', 'min-h-screen');

        const cardContainer = screen.getByText('productCategory').closest('div');
        expect(cardContainer).toHaveClass('bg-white', 'shadow-xl', 'rounded-2xl', 'p-8');
    });

    it('displays custom legend with color indicators', async () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        // Check that color indicators are present (styled spans)
        const colorIndicators = document.querySelectorAll('span[style*="background-color"]');
        expect(colorIndicators).toHaveLength(4); // One for each category
    });

    it('calls getProductCategories API on component mount', () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        expect(mockGetProductCategories).toHaveBeenCalledTimes(1);
    });

    it('configures chart options correctly', async () => {
        mockGetProductCategories.mockResolvedValue(createSuccessResponse(mockProductCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        const chartElement = screen.getByTestId('doughnut-chart');
        const chartOptions = JSON.parse(chartElement.getAttribute('data-chart-options') || '{}');

        expect(chartOptions.maintainAspectRatio).toBe(false);
        expect(chartOptions.plugins.legend.display).toBe(false);
        expect(chartOptions.plugins.tooltip).toBeDefined();
    });

    it('handles single category data correctly', async () => {
        const singleCategoryData: ProductCategoryResponse = {
            categories: ['Electronics'],
            data: [50]
        };

        mockGetProductCategories.mockResolvedValue(createSuccessResponse(singleCategoryData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        expect(screen.getByText('Electronics')).toBeInTheDocument();
        expect(screen.getByText('50 (100.0%)')).toBeInTheDocument(); // 100% for single category
        expect(screen.getByText('50')).toBeInTheDocument(); // Total products
    });

    it('calculates totals correctly with different data sets', async () => {
        // Test with first set of data
        const firstData: ProductCategoryResponse = {
            categories: ['Category A', 'Category B'],
            data: [10, 20]
        };

        mockGetProductCategories.mockResolvedValue(createSuccessResponse(firstData));

        const { unmount } = render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        expect(screen.getByText('30')).toBeInTheDocument(); // Total: 10 + 20

        // Unmount and test with different data
        unmount();

        const secondData: ProductCategoryResponse = {
            categories: ['Category A', 'Category B', 'Category C'],
            data: [15, 25, 10]
        };

        mockGetProductCategories.mockResolvedValue(createSuccessResponse(secondData));

        render(<ProductCategories />);

        await waitFor(() => {
            expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
        });

        expect(screen.getByText('50')).toBeInTheDocument(); // New total: 15 + 25 + 10
    });
});
