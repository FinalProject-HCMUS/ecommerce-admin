import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddOrderInformation from '../../../../../src/components/page/order/add-page/AddOrderInformation';
import React from 'react';
import { vi } from 'vitest';

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
vi.mock('../../../../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));

import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('AddOrderInformation', () => {
    const defaultFormData = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        paymentMethod: '',
        status: '',
        note: '',
        deliveryDate: '', // or a valid date string if required
        shippingCost: 0,
        productCost: 0,
        subTotal: 0,
        total: 0,
    };

    it('renders all input fields', () => {
        render(
            <AddOrderInformation
                formData={defaultFormData}
                setFormData={vi.fn()}
            />
        );
        expect(screen.getByLabelText('firstName')).toBeInTheDocument();
        expect(screen.getByLabelText('lastName')).toBeInTheDocument();
        expect(screen.getByLabelText('phone')).toBeInTheDocument();
        expect(screen.getByLabelText('address')).toBeInTheDocument();
        expect(screen.getByLabelText('paymentMethod')).toBeInTheDocument();
        expect(screen.getByLabelText('status')).toBeInTheDocument();
    });

    it('calls setFormData on input change', () => {
        const setFormData = vi.fn();
        render(
            <AddOrderInformation
                formData={defaultFormData}
                setFormData={setFormData}
            />
        );
        fireEvent.change(screen.getByLabelText('firstName'), { target: { value: 'Alice' } });
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
    });

    it('shows error toast if required fields are missing on next', () => {
        render(
            <AddOrderInformation
                formData={defaultFormData}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('next'));
        expect(toast.error).toHaveBeenCalledWith('fillCondition', expect.objectContaining({
            autoClose: 1000,
            position: 'top-right',
        }));
    });

    it('navigates to next step if all required fields are filled', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <AddOrderInformation
                formData={{
                    firstName: 'Alice',
                    lastName: 'Smith',
                    phoneNumber: '1234567890',
                    address: '123 Main St',
                    paymentMethod: 'COD',
                    status: 'NEW',
                    note: '',
                }}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('next'));
        expect(navigate).toHaveBeenCalledWith('/orders/add/product');
    });

    it('navigates back when cancel is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <AddOrderInformation
                formData={defaultFormData}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });
});