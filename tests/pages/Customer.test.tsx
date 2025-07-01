import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import Customers from '../../src/pages/Customers';

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
vi.mock('../../src/apis/userApi', () => ({
    getUsers: vi.fn(),
}));
vi.mock('../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../src/components/customer/CustomerTable', () => ({
    __esModule: true,
    default: ({ customers }: any) => (
        <div>
            {customers.map((c: any) => (
                <div key={c.id}>{c.firstName} {c.lastName}</div>
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

import { getUsers } from '../../src/apis/userApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('Customers page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading spinner initially', async () => {
        (getUsers as any).mockResolvedValueOnce({ isSuccess: true, data: { content: [], totalPages: 1 } });
        render(<Customers />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        await waitFor(() => {
            expect(getUsers).toHaveBeenCalled();
        });
    });

    it('renders customer table after loading', async () => {
        (getUsers as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', firstName: 'John', lastName: 'Doe' },
                    { id: '2', firstName: 'Jane', lastName: 'Smith' },
                ],
                totalPages: 1,
            },
        });
        render(<Customers />);
        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        });
    });

    it('shows error toast if getUsers fails', async () => {
        (getUsers as any).mockResolvedValueOnce({ isSuccess: false, message: 'error!' });
        render(<Customers />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('error!', { autoClose: 1000 });
        });
    });

    it('navigates to add customer page when add button is clicked', async () => {
        (getUsers as any).mockResolvedValueOnce({ isSuccess: true, data: { content: [], totalPages: 1 } });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<Customers />);
        fireEvent.click(screen.getByText('addCustomer'));
        expect(navigate).toHaveBeenCalledWith('/customers/add');
    });

    it('searches when Enter is pressed', async () => {
        (getUsers as any).mockResolvedValue({ isSuccess: true, data: { content: [], totalPages: 1 } });
        render(<Customers />);
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'Jane' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await waitFor(() => {
            expect(getUsers).toHaveBeenCalled();
        });
    });

    it('changes page when pagination next is clicked', async () => {
        (getUsers as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [],
                totalPages: 2,
            },
        });
        render(<Customers />);
        await waitFor(() => {
            expect(getUsers).toHaveBeenCalled();
        });
        fireEvent.click(screen.getByText('Next'));
        await waitFor(() => {
            expect(getUsers).toHaveBeenCalledTimes(2);
        });
    });
});