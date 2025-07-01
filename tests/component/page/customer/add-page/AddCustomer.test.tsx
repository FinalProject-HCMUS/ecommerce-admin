import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import AddCustomer from '../../../../../src/components/page/customer/add-page/AddCustomer';

// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('../../../../../src/apis/userApi', () => ({
    createUser: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

import * as userApi from '../../../../../src/apis/userApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('AddCustomer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all fields and buttons', () => {
        render(<AddCustomer />);
        expect(screen.getByText('addCustomer')).toBeInTheDocument();
        expect(screen.getByText('firstName')).toBeInTheDocument();
        expect(screen.getByText('lastName')).toBeInTheDocument();
        expect(screen.getByText('email')).toBeInTheDocument();
        expect(screen.getByText('password')).toBeInTheDocument();
        expect(screen.getByText('phone')).toBeInTheDocument();
        expect(screen.getByText('address')).toBeInTheDocument();
        expect(screen.getByText('weight')).toBeInTheDocument();
        expect(screen.getByText('height')).toBeInTheDocument();
        expect(screen.getByText('status')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('add')).toBeInTheDocument();
    });

    it('calls createUser and shows success toast on valid submit', async () => {
        (userApi.createUser as any).mockResolvedValueOnce({ isSuccess: true });
        render(<AddCustomer />);
        fireEvent.change(screen.getByLabelText('firstName'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('lastName'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('password'), { target: { value: 'secret' } });
        fireEvent.change(screen.getByLabelText('phone'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByLabelText('address'), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByLabelText('weight'), { target: { value: 70 } });
        fireEvent.change(screen.getByLabelText('height'), { target: { value: 180 } });
        fireEvent.change(screen.getByLabelText('status'), { target: { value: 'Enabled' } });
        fireEvent.click(screen.getByText('add'));
        await waitFor(() => {
            expect(userApi.createUser).toHaveBeenCalledWith(expect.objectContaining({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'secret',
                phoneNumber: '1234567890',
                address: '123 Main St',
                weight: "70",
                height: "180",
                enabled: true,
            }));
            expect(toast.success).toHaveBeenCalledWith('addCustomerSuccess', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows error toast if createUser fails', async () => {
        (userApi.createUser as any).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(<AddCustomer />);
        fireEvent.change(screen.getByLabelText('firstName'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('lastName'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('password'), { target: { value: 'secret' } });
        fireEvent.change(screen.getByLabelText('phone'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByLabelText('address'), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByLabelText('weight'), { target: { value: 70 } });
        fireEvent.change(screen.getByLabelText('height'), { target: { value: 180 } });
        fireEvent.change(screen.getByLabelText('status'), { target: { value: 'Enabled' } });
        fireEvent.click(screen.getByText('add'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to /customers when cancel is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<AddCustomer />);
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });
});