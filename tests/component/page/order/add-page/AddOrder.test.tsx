import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import AddOrder from '../../../../../src/components/page/order/add-page/AddOrder';

// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
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
vi.mock('../../../../../src/apis/orderApi', () => ({
    createOrder: vi.fn(),
    createListOrderDetails: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mock child components
vi.mock('../../../../../src/components/page/order/add-page/AddOrderInformation', () => ({
    __esModule: true,
    default: ({ formData, setFormData }: any) => (
        <div>
            <input
                placeholder="note"
                value={formData.note || ''}
                onChange={e => setFormData((prev: any) => ({ ...prev, note: e.target.value }))}
            />
        </div>
    ),
}));
vi.mock('../../../../../src/components/page/order/add-page/AddOrderProduct', () => ({
    __esModule: true,
    default: ({ setOrderDetails }: any) => (
        <div>
            <button onClick={() => setOrderDetails([{ itemId: 'item-1', productCost: 10, total: 20, unitPrice: 10, quantity: 2 }])}>Add Order Detail</button>
        </div>
    ),
}));
vi.mock('../../../../../src/components/page/order/add-page/Preview', () => ({
    __esModule: true,
    default: ({ handleSubmit, loading }: any) => (
        <div>
            <button onClick={handleSubmit} disabled={loading}>Save Order</button>
        </div>
    ),
}));

import * as orderApi from '../../../../../src/apis/orderApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('AddOrder', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows error toast if createOrder fails', async () => {
        (orderApi.createOrder as any).mockResolvedValueOnce({ isSuccess: false, message: 'order error' });
        render(<AddOrder />);
        fireEvent.click(screen.getByText('Save Order'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('order error', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows error toast if createListOrderDetails fails', async () => {
        (orderApi.createOrder as any).mockResolvedValueOnce({ isSuccess: true, data: { id: 'order-1' } });
        (orderApi.createListOrderDetails as any).mockResolvedValueOnce({ isSuccess: false, message: 'details error' });
        render(<AddOrder />);
        fireEvent.click(screen.getByText('Add Order Detail'));
        fireEvent.click(screen.getByText('Save Order'));
        await waitFor(() => {
            expect(orderApi.createListOrderDetails).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('details error', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows success toast and navigates on full success', async () => {
        (orderApi.createOrder as any).mockResolvedValueOnce({ isSuccess: true, data: { id: 'order-1' } });
        (orderApi.createListOrderDetails as any).mockResolvedValueOnce({ isSuccess: true });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<AddOrder />);
        fireEvent.click(screen.getByText('Add Order Detail'));
        fireEvent.click(screen.getByText('Save Order'));
        await waitFor(() => {
            expect(orderApi.createOrder).toHaveBeenCalled();
            expect(orderApi.createListOrderDetails).toHaveBeenCalledWith([
                expect.objectContaining({
                    orderId: 'order-1',
                    itemId: 'item-1',
                    productCost: 10,
                    total: 20,
                    unitPrice: 10,
                    quantity: 2,
                }),
            ]);
            expect(toast.success).toHaveBeenCalledWith('addedOrder', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
            expect(navigate).toHaveBeenCalledWith('/orders');
        });
    });

    it('disables submit button while loading', async () => {
        (orderApi.createOrder as any).mockImplementation(() => new Promise(() => { })); // never resolves
        render(<AddOrder />);
        fireEvent.click(screen.getByText('Save Order'));
        expect(screen.getByText('Save Order')).toBeDisabled();
    });
});