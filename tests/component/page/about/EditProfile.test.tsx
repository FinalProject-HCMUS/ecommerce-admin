import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Mock user data
const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '1234567890',
    address: '123 Main St',
    weight: 70,
    height: 175,
    enabled: true,
    photo: 'https://example.com/photo.jpg',
    role: 'ADMIN'
};

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        MemoryRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="memory-router">{children}</div>
    };
});

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                editProfile: 'Edit Profile',
                personalInfo: 'Personal Information',
                firstName: 'First Name',
                lastName: 'Last Name',
                email: 'Email',
                phone: 'Phone',
                address: 'Address',
                weight: 'Weight',
                height: 'Height',
                userRole: 'Role',
                cancel: 'Cancel',
                save: 'Save'
            };
            return translations[key] || key;
        }
    }),
    I18nextProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock AuthContext
vi.mock('../../../../src/context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        setUser: vi.fn(),
    }),
}));

// Mock MotionPage component
vi.mock('../../../../src/components/common/MotionPage', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="motion-page">{children}</div>
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Camera: () => <div data-testid="camera-icon" />
}));

// Mock API functions
vi.mock('../../../../src/apis/imageApi', () => ({
    uploadImage: vi.fn()
}));

vi.mock('../../../../src/apis/userApi', () => ({
    updateProfile: vi.fn()
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:test-url');
global.URL.revokeObjectURL = vi.fn();

// Import the component and mocked modules after mocks
import EditProfile from '../../../../src/components/page/about/edit-page/EditProfile';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../src/context/AuthContext';
import { uploadImage } from '../../../../src/apis/imageApi';
import { updateProfile } from '../../../../src/apis/userApi';
import { toast } from 'react-toastify';

// Get the mocked functions
const mockNavigate = vi.mocked(useNavigate)();
const mockSetUser = vi.mocked(useAuth)().setUser;
const mockUploadImage = vi.mocked(uploadImage);
const mockUpdateProfile = vi.mocked(updateProfile);
const mockToastError = vi.mocked(toast.error);
const mockToastSuccess = vi.mocked(toast.success);

const renderEditProfile = () => {
    return render(
        <MemoryRouter>
            <EditProfile />
        </MemoryRouter>
    );
};

// Helper function to get file input
const getFileInput = () => {
    return document.querySelector('input[type="file"]') as HTMLInputElement;
};

describe('EditProfile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUploadImage.mockResolvedValue({
            isSuccess: true,
            data: 'new-photo-url.jpg',
            timestamp: new Date().toISOString(),
            httpStatus: '200',
            message: 'Success'
        });
        mockUpdateProfile.mockResolvedValue({
            isSuccess: true,
            data: { ...mockUser, firstName: 'Updated' },
            timestamp: new Date().toISOString(),
            httpStatus: '200',
            message: 'Success'
        });
    });

    describe('Component Rendering', () => {
        it('renders the edit profile form with all fields', () => {
            renderEditProfile();

            expect(screen.getByText('Edit Profile')).toBeInTheDocument();
            expect(screen.getByText('Personal Information')).toBeInTheDocument();
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
            expect(screen.getByLabelText('Email')).toBeInTheDocument();
            expect(screen.getByLabelText('Phone')).toBeInTheDocument();
            expect(screen.getByLabelText('Address')).toBeInTheDocument();
            expect(screen.getByLabelText('Weight')).toBeInTheDocument();
            expect(screen.getByLabelText('Height')).toBeInTheDocument();
            expect(screen.getByLabelText('Role')).toBeInTheDocument();
        });

        it('displays user data in form fields', () => {
            renderEditProfile();

            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
            expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
            expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
            expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
            expect(screen.getByDisplayValue('70')).toBeInTheDocument();
            expect(screen.getByDisplayValue('175')).toBeInTheDocument();
            expect(screen.getByDisplayValue('ADMIN')).toBeInTheDocument();
        });

        it('displays profile photo', () => {
            renderEditProfile();

            const profileImage = screen.getByRole('img', { name: 'Profile' });
            expect(profileImage).toHaveAttribute('src', mockUser.photo);
        });

        it('renders camera icon for photo upload', () => {
            renderEditProfile();

            expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
        });

        it('renders cancel and save buttons', () => {
            renderEditProfile();

            expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
        });

        it('has role field disabled', () => {
            renderEditProfile();

            const roleField = screen.getByLabelText('Role');
            expect(roleField).toBeDisabled();
        });
    });

    describe('Form Interactions', () => {
        it('updates form fields when user types', () => {
            renderEditProfile();

            const firstNameField = screen.getByLabelText('First Name');
            fireEvent.change(firstNameField, { target: { value: 'Jane' } });

            expect(firstNameField).toHaveValue('Jane');
        });

        it('updates all form fields correctly', () => {
            renderEditProfile();

            const fields = [
                { label: 'First Name', value: 'Jane' },
                { label: 'Last Name', value: 'Smith' },
                { label: 'Email', value: 'jane@example.com' },
                { label: 'Phone', value: 9876543210 },
                { label: 'Address', value: '456 Oak St' },
                { label: 'Weight', value: 60 },
                { label: 'Height', value: 165 },
            ];

            fields.forEach(({ label, value }) => {
                const field = screen.getByLabelText(label);
                fireEvent.change(field, { target: { value } });
                expect(field).toHaveValue(value);
            });
        });

        it('handles photo upload', () => {
            renderEditProfile();

            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = getFileInput();

            fireEvent.change(fileInput, { target: { files: [file] } });

            expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        });
    });

    describe('Form Submission', () => {
        it('submits form with updated data', async () => {
            renderEditProfile();
            const firstNameField = screen.getByLabelText('First Name');
            fireEvent.change(firstNameField, { target: { value: 'Jane' } });
            const submitButton = screen.getByRole('button', { name: 'Save' });
            fireEvent.click(submitButton);
            await waitFor(() => {
                expect(mockUpdateProfile).toHaveBeenCalledWith('1', {
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    phoneNumber: '1234567890',
                    address: '123 Main St',
                    weight: 70,
                    height: 175,
                    enabled: true,
                    photo: 'https://example.com/photo.jpg',
                    role: 'ADMIN'
                });
            });
        });

        it('uploads image when photo is changed', async () => {
            renderEditProfile();

            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = getFileInput();
            fireEvent.change(fileInput, { target: { files: [file] } });

            const submitButton = screen.getByRole('button', { name: 'Save' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockUploadImage).toHaveBeenCalledWith(file);
            });
        });

        it('disables save button and shows loading state during submission', async () => {
            mockUpdateProfile.mockImplementation(() =>
                new Promise(resolve =>
                    setTimeout(() => resolve({
                        isSuccess: true,
                        data: { ...mockUser, firstName: 'Updated' },
                        timestamp: new Date().toISOString(),
                        httpStatus: '200',
                        message: 'Success'
                    }), 100)
                )
            );

            renderEditProfile();

            const submitButton = screen.getByRole('button', { name: 'Save' });
            fireEvent.click(submitButton);

            expect(submitButton).toBeDisabled();
            expect(submitButton).toHaveClass('opacity-50', 'cursor-not-allowed');
        });
    });

    describe('Error Handling', () => {
        it('shows error toast when image upload fails', async () => {
            mockUploadImage.mockResolvedValue({
                isSuccess: false,
                message: 'Upload failed',
                timestamp: new Date().toISOString(),
                httpStatus: '400'
            });

            renderEditProfile();

            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = getFileInput();
            fireEvent.change(fileInput, { target: { files: [file] } });

            const submitButton = screen.getByRole('button', { name: 'Save' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Upload failed',
                    { autoClose: 1000, position: 'top-right' }
                );
            });

            expect(mockUpdateProfile).not.toHaveBeenCalled();
        });

        it('shows error toast when profile update fails', async () => {
            mockUpdateProfile.mockResolvedValue({
                isSuccess: false,
                message: 'Update failed',
                timestamp: new Date().toISOString(),
                httpStatus: '400'
            });

            renderEditProfile();

            const submitButton = screen.getByRole('button', { name: 'Save' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Update failed',
                    { autoClose: 1000, position: 'top-center' }
                );
            });
        });
    });

    describe('Component Lifecycle', () => {
        it('initializes form with user data on mount', () => {
            renderEditProfile();

            expect(screen.getByDisplayValue('John')).toBeInTheDocument();
            expect(screen.getByRole('img', { name: 'Profile' })).toHaveAttribute('src', mockUser.photo);
        });

        it('handles photo preview correctly', () => {
            renderEditProfile();

            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = getFileInput();
            fireEvent.change(fileInput, { target: { files: [file] } });

            const profileImage = screen.getByRole('img', { name: 'Profile' });
            expect(profileImage).toHaveAttribute('src', 'blob:test-url');
        });

        it('renders within MotionPageWrapper', () => {
            renderEditProfile();

            expect(screen.getByTestId('motion-page')).toBeInTheDocument();
        });
    });

    describe('Form Validation and Edge Cases', () => {
        it('handles empty file selection', () => {
            renderEditProfile();

            const fileInput = getFileInput();
            fireEvent.change(fileInput, { target: { files: [] } });

            // Should not crash and original photo should remain
            const profileImage = screen.getByRole('img', { name: 'Profile' });
            expect(profileImage).toHaveAttribute('src', mockUser.photo);
        });

        it('prevents form submission when already saving', async () => {
            mockUpdateProfile.mockImplementation(() =>
                new Promise(resolve =>
                    setTimeout(() => resolve({
                        isSuccess: true,
                        data: { ...mockUser, firstName: 'Updated' },
                        timestamp: new Date().toISOString(),
                        httpStatus: '200',
                        message: 'Success'
                    }), 100)
                )
            );

            renderEditProfile();

            const submitButton = screen.getByRole('button', { name: 'Save' });
            fireEvent.click(submitButton);
            fireEvent.click(submitButton); // Try to submit again

            await waitFor(() => {
                expect(mockUpdateProfile).toHaveBeenCalledTimes(1);
            });
        });

        it('handles form submission without photo change', async () => {
            renderEditProfile();

            const submitButton = screen.getByRole('button', { name: 'Save' });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(mockUploadImage).not.toHaveBeenCalled();
                expect(mockUpdateProfile).toHaveBeenCalled();
            });
        });

        it('renders correctly when user data is available', () => {
            renderEditProfile();

            // Check that the form is rendered when user data exists
            expect(screen.getByText('Personal Information')).toBeInTheDocument();
            expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        });

        it('has correct form field types', () => {
            renderEditProfile();

            expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
            expect(screen.getByLabelText('Phone')).toHaveAttribute('type', 'number');
            expect(screen.getByLabelText('Weight')).toHaveAttribute('type', 'number');
            expect(screen.getByLabelText('Height')).toHaveAttribute('type', 'number');
        });
    });
});
