import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import Orders from '../../src/pages/Order';

// Mocks
vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));
vi.mock('../../src/apis/orderApi', () => ({
    getOrders: vi.fn(),
}));
vi.mock('../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../src/components/order/OrderTable', () => ({
    __esModule: true,
    default: ({ orders }: any) => (
        <div>
            {orders.map((o: any) => (
                <div key={o.id}>{o.id} {o.status}</div>
            ))}
        </div>
    ),
}));
vi.mock('../../src/components/common/Pagination', () => ({
    __esModule: true,
    default: ({ currentPage, totalPages, onPageChange }: any) => (
        <div>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
        </div>
    ),
}));

import { getOrders } from '../../src/apis/orderApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('Orders page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading spinner initially', async () => {
        (getOrders as any).mockResolvedValueOnce({ isSuccess: true, data: { content: [], totalPages: 1 } });
        render(<Orders />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        await waitFor(() => {
            expect(getOrders).toHaveBeenCalled();
        });
    });

    it('renders order table after loading', async () => {
        (getOrders as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', status: 'NEW' },
                    { id: '2', status: 'SHIPPED' },
                ],
                totalPages: 1,
            },
        });
        render(<Orders />);
        await waitFor(() => {
            expect(screen.getByText('1 NEW')).toBeInTheDocument();
            expect(screen.getByText('2 SHIPPED')).toBeInTheDocument();
        });
    });

    it('shows error toast if getOrders fails', async () => {
        (getOrders as any).mockResolvedValueOnce({ isSuccess: false, message: 'error!' });
        render(<Orders />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('error!', { autoClose: 1000 });
        });
    });

    it('navigates to add order page when add button is clicked', async () => {
        (getOrders as any).mockResolvedValueOnce({ isSuccess: true, data: { content: [], totalPages: 1 } });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<Orders />);
        fireEvent.click(screen.getByText('addNewOrder'));
        expect(navigate).toHaveBeenCalledWith('/orders/add/information');
    });

    it('searches when Enter is pressed', async () => {
        (getOrders as any).mockResolvedValue({ isSuccess: true, data: { content: [], totalPages: 1 } });
        render(<Orders />);
        const input = screen.getByPlaceholderText('searchOrder');
        fireEvent.change(input, { target: { value: 'order123' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await waitFor(() => {
            expect(getOrders).toHaveBeenCalled();
        });
    });

    it('changes page when pagination next is clicked', async () => {
        (getOrders as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [],
                totalPages: 2,
            },
        });
        render(<Orders />);
        await waitFor(() => {
            expect(getOrders).toHaveBeenCalled();
        });
        fireEvent.click(screen.getByText('Next'));
        await waitFor(() => {
            expect(getOrders).toHaveBeenCalledTimes(2);
        });
    });

    it('filters by status', async () => {
        (getOrders as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [],
                totalPages: 1,
            },
        });
        render(<Orders />);
        const statusSelect = screen.getAllByRole('combobox')[0];
        fireEvent.mouseDown(statusSelect);
        const options = await screen.findAllByText('NEW');
        fireEvent.click(options[0]);
        await waitFor(() => {
            expect(getOrders).toHaveBeenCalledTimes(1);
        });
    });

    it('filters by payment method', async () => {
        (getOrders as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [],
                totalPages: 1,
            },
        });
        render(<Orders />);
        const paymentSelect = screen.getAllByRole('combobox')[1];
        fireEvent.mouseDown(paymentSelect);
        fireEvent.change(paymentSelect, { target: { value: 'COD' } });
        await waitFor(() => {
            expect(getOrders).toHaveBeenCalledTimes(1);
        });
    });
});