import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import EditOrderInformation from '../../../../../src/components/page/order/edit-page/EditOrderInformation';

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

describe('EditOrderInformation', () => {
    const defaultFormData = {
        id: 'order-1',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        paymentMethod: '',
        status: '',
        note: '',
        productCost: 0,
        shippingCost: 0,
        total: 0,
    };

    it('renders all input fields', () => {
        render(
            <EditOrderInformation
                formData={defaultFormData as any}
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
            <EditOrderInformation
                formData={defaultFormData as any}
                setFormData={setFormData}
            />
        );
        fireEvent.change(screen.getByLabelText('firstName'), { target: { value: 'Alice' } });
        expect(setFormData).toHaveBeenCalledWith(expect.any(Function));
    });

    it('shows error toast if required fields are missing on next', () => {
        render(
            <EditOrderInformation
                formData={defaultFormData as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('next'));
        expect(toast.error).toHaveBeenCalledWith(
            "Please fill in all required fields.",
            expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            })
        );
    });

    it('navigates to next step if all required fields are filled', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <EditOrderInformation
                formData={{
                    ...defaultFormData,
                    firstName: 'Alice',
                    lastName: 'Smith',
                    phoneNumber: '1234567890',
                    address: '123 Main St',
                    paymentMethod: 'COD',
                    status: 'NEW',
                } as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('next'));
        expect(navigate).toHaveBeenCalledWith('/orders/edit/order-1/product');
    });

    it('navigates back when cancel is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <EditOrderInformation
                formData={defaultFormData as any}
                setFormData={vi.fn()}
            />
        );
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });
});