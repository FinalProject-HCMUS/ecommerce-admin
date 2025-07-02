import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as React from 'react';
import { vi } from 'vitest';
import Setting from '../../src/pages/Setting';
import { SystemSetting } from '../../src/types/settings/SystemSetting';
import { CustomResponse } from '../../src/types/common/CustomResponse';
import { SystemSettingUpdate } from '../../src/types/settings/SystemSettingUpdate';

// Mock data
const mockServiceNames = ['user-service', 'product-service', 'order-service'];
const mockSystemSettings: SystemSetting[] = [
    {
        id: '1',
        key: 'database.url',
        value: 'localhost:5432',
        serviceName: 'user-service'
    },
    {
        id: '2',
        key: 'cache.ttl',
        value: '3600',
        serviceName: 'user-service'
    },
    {
        id: '3',
        key: 'api.timeout',
        value: '30000',
        serviceName: 'user-service'
    }
];

const mockSuccessResponse: CustomResponse<string> = {
    timestamp: '2025-07-02T10:00:00Z',
    httpStatus: '200',
    isSuccess: true,
    message: 'Settings updated successfully',
    data: 'success'
};

const mockErrorResponse: CustomResponse<string> = {
    timestamp: '2025-07-02T10:00:00Z',
    httpStatus: '400',
    isSuccess: false,
    message: 'Failed to update settings',
    data: undefined
};

// Mock functions
const mockGetServiceNames = vi.fn();
const mockGetSystemSettingByServiceName = vi.fn();
const mockUpdateSystemSetting = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

// API Mocks
vi.mock('../../src/apis/settingApi', () => ({
    getServiceNames: () => mockGetServiceNames(),
    getSystemSettingByServiceName: (serviceName: string) => mockGetSystemSettingByServiceName(serviceName),
    updateSystemSetting: (updates: SystemSettingUpdate[]) => mockUpdateSystemSetting(updates),
}));

// Component Mocks
vi.mock('../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="motion-page">{children}</div>,
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, fallback?: string) => fallback || key,
    }),
}));

interface ToastOptions {
    position: string;
    autoClose: number;
}

vi.mock('react-toastify', () => ({
    toast: {
        success: (message: string, options?: ToastOptions) => mockToastSuccess(message, options),
        error: (message: string, options?: ToastOptions) => mockToastError(message, options),
    },
}));

interface SelectProps {
    children: React.ReactNode;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    [key: string]: unknown;
}

interface OptionProps {
    children: React.ReactNode;
    value: string;
    [key: string]: unknown;
}

// Mock Antd Select and Option components
vi.mock('antd', () => {
    const MockSelect = ({ children, value, onChange, disabled, ...props }: SelectProps) => (
        <select
            data-testid="service-select"
            value={value || ''}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            {...props}
        >
            {children}
        </select>
    );

    const MockOption = ({ children, value, ...props }: OptionProps) => (
        <option value={value} {...props}>
            {children}
        </option>
    );

    // Assign Option to Select as a property
    (MockSelect as any).Option = MockOption;

    return {
        Select: MockSelect,
    };
});

describe('Setting Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Always resolve with proper data for consistent tests
        mockGetServiceNames.mockResolvedValue(mockServiceNames);
        mockGetSystemSettingByServiceName.mockResolvedValue(mockSystemSettings);
        mockUpdateSystemSetting.mockResolvedValue(mockSuccessResponse);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('renders setting page with title', async () => {
        render(<Setting />);
        expect(screen.getByText('settings')).toBeInTheDocument();
        expect(screen.getByTestId('motion-page')).toBeInTheDocument();
    });

    it('loads service names on mount', async () => {
        render(<Setting />);
        await waitFor(() => {
            expect(mockGetServiceNames).toHaveBeenCalledTimes(1);
        });
    });

    it('renders service name label', async () => {
        render(<Setting />);
        expect(screen.getByText('serviceName')).toBeInTheDocument();
    });

    it('renders save button', async () => {
        render(<Setting />);
        expect(screen.getByText('save')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders service select dropdown', async () => {
        render(<Setting />);
        await waitFor(() => {
            expect(screen.getByTestId('service-select')).toBeInTheDocument();
        });
    });

    it('handles empty service names response', async () => {
        mockGetServiceNames.mockResolvedValue([]);
        render(<Setting />);
        await waitFor(() => {
            expect(mockGetServiceNames).toHaveBeenCalledTimes(1);
        });
        // Should still render the page structure
        expect(screen.getByText('settings')).toBeInTheDocument();
    });

    it('handles form submission with empty settings', async () => {
        mockGetSystemSettingByServiceName.mockResolvedValue([]);
        render(<Setting />);

        await waitFor(() => {
            expect(screen.getByText('save')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('save');
        fireEvent.click(saveButton);

        // Should call API with empty array
        await waitFor(() => {
            expect(mockUpdateSystemSetting).toHaveBeenCalledWith([]);
        });
    });

    it('shows error toast on save failure', async () => {
        mockUpdateSystemSetting.mockResolvedValue(mockErrorResponse);
        render(<Setting />);

        await waitFor(() => {
            expect(screen.getByText('save')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith(
                'Failed to update settings',
                { position: 'top-right', autoClose: 1000 }
            );
        });
    });

    it('shows success toast on successful save', async () => {
        render(<Setting />);

        await waitFor(() => {
            expect(screen.getByText('save')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockToastSuccess).toHaveBeenCalledWith(
                'Lưu thành công',
                { position: 'top-right', autoClose: 1000 }
            );
        });
    });
});
