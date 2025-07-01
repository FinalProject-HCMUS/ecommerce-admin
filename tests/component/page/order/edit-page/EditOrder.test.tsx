import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import EditOrder from '../../../../../src/components/page/order/edit-page/EditOrder';
import * as orderApi from '../../../../../src/apis/orderApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

declare global {
    interface Window {
        __step?: string;
    }
}
// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useParams: () => ({ id: 'order-1' }),
        Routes: ({ children }: any) => <div>{children}</div>,
        Route: ({ element }: any) => element,
    };
});
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('../../../../../src/context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 'user-1' },
    }),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mock child components
vi.mock('../../../../../src/components/page/order/edit-page/EditOrderInformation', () => ({
    __esModule: true,
    default: ({ formData, setFormData }: any) => (
        <div>
            <input
                placeholder="note"
                value={formData.note || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, note: e.target.value }))}
            />
            <button onClick={() => window.__step = 'product'}>next</button>
        </div>
    ),
}));
vi.mock('../../../../../src/components/page/order/edit-page/EditOrderProduct', () => ({
    __esModule: true,
    default: ({ setOrderDetails }: any) => (
        <div>
            <button onClick={() => setOrderDetails([{ id: 'detail-1', productCost: 10, total: 20, unitPrice: 10, quantity: 2 }])}>Edit Order Detail</button>
            <button onClick={() => window.__step = 'preview'}>next</button>
        </div>
    ),
}));
vi.mock('../../../../../src/components/page/order/edit-page/Preview', () => ({
    __esModule: true,
    default: ({ handleSubmit, loading }: any) => (
        <div>
            <button onClick={handleSubmit} disabled={loading}>update</button>
        </div>
    ),
}));

vi.mock('../../../../../src/apis/orderApi', async () => {
    const actual: any = await vi.importActual('../../../../../src/apis/orderApi');
    return {
        ...actual,
        updateOrder: vi.fn(),
        updateOrderDetail: vi.fn(),
        createOrderDetail: vi.fn(),
        getOrderById: vi.fn(),
        getOrderDetailByOrderId: vi.fn(),
    };
});
describe('EditOrder', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (orderApi.getOrderById as any).mockResolvedValue({
            isSuccess: true,
            data: {
                id: 'order-1',
                firstName: 'Alice',
                lastName: 'Smith',
                phoneNumber: '1234567890',
                address: '123 Main St',
                paymentMethod: 'COD',
                status: 'NEW',
                note: '',
                productCost: 100,
                shippingCost: 10,
                total: 110,
            },
        });
        (orderApi.getOrderDetailByOrderId as any).mockResolvedValue({
            isSuccess: true,
            data: [
                { id: 'detail-1', productCost: 100, total: 200, unitPrice: 100, quantity: 2 }
            ]
        });
        (orderApi.updateOrder as any).mockResolvedValue({ isSuccess: true });
        (orderApi.updateOrderDetail as any).mockResolvedValue({ isSuccess: true });
        (orderApi.createOrderDetail as any).mockResolvedValue({ isSuccess: true });
    });

    function renderEditOrder() {
        return render(<EditOrder />);
    }

    function goToPreviewStep() {
        fireEvent.click(screen.getByText('next')); // from information to product
        fireEvent.click(screen.getByText('Edit Order Detail')); // set order details
        fireEvent.click(screen.getByText('next')); // from product to preview
    }

    it('renders EditOrderInformation and allows note input', async () => {
        renderEditOrder();
        const noteInput = await screen.findByPlaceholderText('note');
        fireEvent.change(noteInput, { target: { value: 'Test note' } });
        expect((noteInput as HTMLInputElement).value).toBe('Test note');
    });

    it('shows loading spinner when formData.id is not set', async () => {
        (orderApi.getOrderById as any).mockResolvedValueOnce({
            isSuccess: false,
            data: null,
        });
        render(<EditOrder />);
        await waitFor(() => {
            expect(screen.getByRole('status')).toBeInTheDocument();
        });
    });
});