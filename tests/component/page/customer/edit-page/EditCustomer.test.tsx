import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditCustomer from '../../../../../src/components/page/customer/edit-page/EditCustomer';
import React from 'react';
import { vi } from 'vitest';

// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useParams: () => ({ id: '123' }),
    };
});
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
vi.mock('../../../../../src/apis/userApi', () => ({
    getUserById: vi.fn(),
    updateProfile: vi.fn(),
}));
vi.mock('../../../../../src/apis/imageApi', () => ({
    uploadImage: vi.fn(),
}));
vi.mock('../../../../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));

import * as userApi from '../../../../../src/apis/userApi';
import * as imageApi from '../../../../../src/apis/imageApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('EditCustomer', () => {
    const mockUser = {
        id: '123',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phoneNumber: '5551234567',
        address: '456 Elm St',
        weight: 60,
        height: 170,
        enabled: true,
        photo: '',
        role: 'CUSTOMER',
    };
    // Mock URL.createObjectURL for file input preview in tests
    beforeAll(() => {
        global.URL.createObjectURL = vi.fn(() => 'mock-url');
    });
    beforeEach(() => {
        vi.clearAllMocks();
        (userApi.getUserById as any).mockResolvedValue({
            isSuccess: true,
            data: { ...mockUser },
        });
    });

    it('renders all fields with user data', async () => {
        render(<EditCustomer />);
        expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
        expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('5551234567')).toBeInTheDocument();
        expect(screen.getByDisplayValue('456 Elm St')).toBeInTheDocument();
        expect(screen.getByDisplayValue('60')).toBeInTheDocument();
        expect(screen.getByDisplayValue('170')).toBeInTheDocument();
        expect(screen.getByDisplayValue('CUSTOMER')).toBeInTheDocument();
    });

    it('shows loading spinner while fetching user', async () => {
        let resolveUser: any;
        (userApi.getUserById as any).mockImplementation(
            () => new Promise(res => { resolveUser = res; })
        );
        render(<EditCustomer />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        resolveUser({ isSuccess: true, data: mockUser });
        await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
        });
    });

    it('shows error toast if getUserById fails', async () => {
        (userApi.getUserById as any).mockResolvedValueOnce({
            isSuccess: false,
            message: 'Not found',
        });
        render(<EditCustomer />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Not found', expect.any(Object));
        });
    });

    it('updates fields and submits successfully', async () => {
        (userApi.updateProfile as any).mockResolvedValueOnce({ isSuccess: true });
        render(<EditCustomer />);
        expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText('firstName'), { target: { value: 'Janet' } });
        fireEvent.change(screen.getByLabelText('weight'), { target: { value: '65' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(userApi.updateProfile).toHaveBeenCalledWith('123', expect.objectContaining({
                firstName: 'Janet',
                weight: '65',
            }));
            expect(toast.success).toHaveBeenCalledWith('editCustomerSuccess', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
                onClose: expect.any(Function),
            }));
        });
    });

    it('shows error toast if updateProfile fails', async () => {
        (userApi.updateProfile as any).mockResolvedValueOnce({
            isSuccess: false,
            message: 'Update failed',
        });
        render(<EditCustomer />);
        expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Update failed', expect.any(Object));
        });
    });

    it('uploads image and updates photo on submit', async () => {
        (imageApi.uploadImage as any).mockResolvedValueOnce({
            isSuccess: true,
            data: 'https://example.com/photo.jpg',
        });
        (userApi.updateProfile as any).mockResolvedValueOnce({ isSuccess: true });
        render(<EditCustomer />);
        expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
        const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
        const input = screen.getByTestId('profile-input');
        fireEvent.change(input, { target: { files: [file] } });
        // Wait for React state to update after file input change
        await waitFor(() => { });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(imageApi.uploadImage).toHaveBeenCalledWith(file);
            expect(userApi.updateProfile).toHaveBeenCalledWith('123', expect.objectContaining({
                photo: 'https://example.com/photo.jpg',
            }));
        });
    });

    it('shows error toast if image upload fails', async () => {
        (imageApi.uploadImage as any).mockResolvedValueOnce({
            isSuccess: false,
            message: 'Image error',
        });
        render(<EditCustomer />);
        expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
        const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
        const input = screen.getByTestId('profile-input');
        fireEvent.change(input, { target: { files: [file] } });
        await waitFor(() => { }); // let React update state
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Image error', expect.any(Object));
        });
    });

    it('navigates back when cancel is clicked', async () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<EditCustomer />);
        expect(await screen.findByDisplayValue('Jane')).toBeInTheDocument();
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });
});