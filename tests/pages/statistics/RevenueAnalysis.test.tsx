import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import RevenueAnalysis from '../../../src/pages/statistics/RevenueAnalysis';
import { RevenueResponse } from '../../../src/types/statistics/RevenueResponse';
import { CustomResponse } from '../../../src/types/common/CustomResponse';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'revenueStatistics': 'Revenue Statistics',
                'income': 'Income',
                'expense': 'Expense',
                'balance': 'Balance',
                'revenueTrend': 'Revenue Trend',
                'monthly': 'Monthly',
                'yearly': 'Yearly',
                'sortBy': 'Sort by',
                'month': 'Month',
                'year': 'Year'
            };
            return translations[key] || key;
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
        success: vi.fn(),
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
    Line: ({ data, options }: { data: unknown; options: unknown }) => (
        <div data-testid="line-chart">
            <div data-testid="chart-data">{JSON.stringify(data)}</div>
            <div data-testid="chart-options">{JSON.stringify(options)}</div>
        </div>
    ),
}));

// Mock react-datepicker
vi.mock('react-datepicker', () => ({
    __esModule: true,
    default: ({ selected, onChange, showMonthYearPicker, showYearPicker, className, placeholderText }: {
        selected: Date;
        onChange: (date: Date) => void;
        showMonthYearPicker?: boolean;
        showYearPicker?: boolean;
        className: string;
        placeholderText: string;
    }) => (
        <input
            data-testid={showMonthYearPicker ? "month-picker" : showYearPicker ? "year-picker" : "date-picker"}
            type="text"
            value={selected.toISOString()}
            onChange={(e) => onChange(new Date(e.target.value))}
            className={className}
            placeholder={placeholderText}
        />
    ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    ArrowUpRight: () => <div data-testid="arrow-up-right-icon" />,
    ArrowDownRight: () => <div data-testid="arrow-down-right-icon" />,
    DollarSign: () => <div data-testid="dollar-sign-icon" />,
}));

// Mock statistics API
vi.mock('../../../src/apis/statisticsApi', () => ({
    getRevenueResponse: vi.fn(),
}));

// Mock currency utility
vi.mock('../../../src/utils/currency', () => ({
    formatPrice: (price: number) => `$${price.toLocaleString()}`,
}));

// Import the mocked functions
import { getRevenueResponse } from '../../../src/apis/statisticsApi';
import { toast } from 'react-toastify';
const mockGetRevenueResponse = vi.mocked(getRevenueResponse);
const mockToast = vi.mocked(toast);

describe('RevenueAnalysis', () => {
    const mockRevenueData: RevenueResponse = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        revenues: [1000, 1500, 2000, 1200, 1800, 2200, 2500, 2100, 1900, 2300, 2600, 2800],
        totalIncome: [50000, 48000],
        totalExpense: [30000, 32000],
        totalBalance: [20000, 16000]
    };

    const createSuccessResponse = <T,>(data: T) => ({
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
        mockGetRevenueResponse.mockResolvedValue(createSuccessResponse(mockRevenueData));
    });

    it('renders the revenue analysis page correctly after loading', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByText('Income')).toBeInTheDocument();
        });

        expect(screen.getByText('Revenue Statistics')).toBeInTheDocument();
        expect(screen.getByText('Income')).toBeInTheDocument();
        expect(screen.getByText('Expense')).toBeInTheDocument();
        expect(screen.getByText('Balance')).toBeInTheDocument();
        expect(screen.getByText('Revenue Trend (Monthly)')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('loads revenue data on mount', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(mockGetRevenueResponse).toHaveBeenCalledWith(
                'month',
                expect.stringMatching(/^\d{2}-\d{4}$/) // MM-YYYY format
            );
        });
    });

    it('displays revenue metrics correctly', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByText('$50,000')).toBeInTheDocument(); // Total income
        });

        expect(screen.getByText('$30,000')).toBeInTheDocument(); // Total expense
        expect(screen.getByText('$20,000')).toBeInTheDocument(); // Total balance
    });

    it('handles type change from month to year', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByText('Income')).toBeInTheDocument();
        });

        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        await waitFor(() => {
            expect(mockGetRevenueResponse).toHaveBeenCalledWith(
                'year',
                expect.stringMatching(/^\d{4}$/) // YYYY format
            );
        });

        expect(screen.getByText('Revenue Trend (Yearly)')).toBeInTheDocument();
    });

    it('handles month picker changes', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByText('Income')).toBeInTheDocument();
        });

        const monthPicker = screen.getByTestId('month-picker');
        const newDate = new Date(2024, 5, 1); // June 2024
        fireEvent.change(monthPicker, { target: { value: newDate.toISOString() } });

        await waitFor(() => {
            expect(mockGetRevenueResponse).toHaveBeenCalledWith(
                'month',
                '06-2024'
            );
        });
    });

    it('handles year picker changes when type is year', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByText('Income')).toBeInTheDocument();
        });

        // Switch to year type first
        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        await waitFor(() => {
            expect(screen.getByTestId('year-picker')).toBeInTheDocument();
        });

        const yearPicker = screen.getByTestId('year-picker');
        const newDate = new Date(2023, 0, 1); // 2023
        fireEvent.change(yearPicker, { target: { value: newDate.toISOString() } });

        await waitFor(() => {
            expect(mockGetRevenueResponse).toHaveBeenCalledWith(
                'year',
                '2023'
            );
        });
    });

    it('renders chart with correct data', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });

        const chartData = screen.getByTestId('chart-data');
        const parsedData = JSON.parse(chartData.textContent || '{}');

        expect(parsedData.datasets[0].label).toBe('Revenue');
        expect(parsedData.datasets[0].data).toEqual(mockRevenueData.revenues);
        expect(parsedData.datasets[0].borderColor).toBe('#4F46E5');
    });

    it('formats chart labels correctly for monthly view', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });

        const chartData = screen.getByTestId('chart-data');
        const parsedData = JSON.parse(chartData.textContent || '{}');

        // Labels should be formatted as DD-MM for monthly view
        expect(parsedData.labels[0]).toMatch(/^\d{2}-\d{2}$/);
    });

    it('formats chart labels correctly for yearly view', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByText('Income')).toBeInTheDocument();
        });

        // Switch to year type
        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        await waitFor(() => {
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });

        const chartData = screen.getByTestId('chart-data');
        const parsedData = JSON.parse(chartData.textContent || '{}');

        // Labels should be just numbers for yearly view
        expect(parsedData.labels[0]).toBe('1');
    });

    it('handles API error when loading revenue data', async () => {
        mockGetRevenueResponse.mockResolvedValue(createErrorResponse('Failed to load revenue data'));

        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(mockGetRevenueResponse).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to load revenue data',
                { position: 'top-right', autoClose: 1000 }
            );
        });
    });

    it('displays correct date picker based on type', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByText('Income')).toBeInTheDocument();
        });

        // Initially should show month picker
        expect(screen.getByTestId('month-picker')).toBeInTheDocument();
        expect(screen.queryByTestId('year-picker')).not.toBeInTheDocument();

        // Switch to year type
        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        await waitFor(() => {
            expect(screen.getByTestId('year-picker')).toBeInTheDocument();
        });

        expect(screen.queryByTestId('month-picker')).not.toBeInTheDocument();
    });

    it('uses correct chart options', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        });

        const chartOptions = screen.getByTestId('chart-options');
        const parsedOptions = JSON.parse(chartOptions.textContent || '{}');

        expect(parsedOptions.maintainAspectRatio).toBe(false);
        expect(parsedOptions.plugins.legend.display).toBe(false);
        expect(parsedOptions.scales.y.beginAtZero).toBe(true);
    });

    it('refetches data when date or type changes', async () => {
        render(<RevenueAnalysis />);

        await waitFor(() => {
            expect(mockGetRevenueResponse).toHaveBeenCalledTimes(1);
        });

        // Change month
        const monthPicker = screen.getByTestId('month-picker');
        const newDate = new Date(2024, 5, 1);
        fireEvent.change(monthPicker, { target: { value: newDate.toISOString() } });

        await waitFor(() => {
            expect(mockGetRevenueResponse).toHaveBeenCalledTimes(2);
        });

        // Change type
        const typeSelect = screen.getByDisplayValue('Month');
        fireEvent.change(typeSelect, { target: { value: 'year' } });

        await waitFor(() => {
            expect(mockGetRevenueResponse).toHaveBeenCalledTimes(3);
        });
    });

    it('handles loading state correctly during data fetch', async () => {
        let resolvePromise: (value: CustomResponse<RevenueResponse>) => void;
        const promise = new Promise<CustomResponse<RevenueResponse>>((resolve) => {
            resolvePromise = resolve;
        });
        mockGetRevenueResponse.mockReturnValue(promise);

        render(<RevenueAnalysis />);

        // Should show loading state
        expect(screen.getByRole('status')).toBeInTheDocument();

        // Resolve the promise
        resolvePromise!(createSuccessResponse(mockRevenueData));

        await waitFor(() => {
            expect(screen.getByText('Income')).toBeInTheDocument();
        });

        // Loading state should be gone
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('displays loading spinner with correct accessibility attributes', () => {
        mockGetRevenueResponse.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<RevenueAnalysis />);

        const loadingSpinner = screen.getByRole('status');
        expect(loadingSpinner).toBeInTheDocument();
        expect(loadingSpinner).toHaveClass('flex', 'justify-center', 'items-center', 'h-[400px]');

        const spinner = loadingSpinner.querySelector('.animate-spin');
        expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'h-16', 'w-16', 'border-t-4', 'border-blue-500', 'border-solid');
    });
});
