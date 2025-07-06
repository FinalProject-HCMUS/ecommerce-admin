import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import UploadImageModal from '../../../src/components/blogs/UploadImageModal';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'uploadImage': 'Upload Image',
                'image': 'Image',
                'placeholderImage': 'Click to upload or drag and drop',
                'supportImage': 'PNG, JPG up to 10MB',
                'preview': 'Preview',
                'back': 'Cancel',
                'submit': 'Submit'
            };
            return translations[key] || key;
        },
        i18n: {
            language: 'en'
        }
    }),
    initReactI18next: {
        type: '3rdParty',
        init: () => { }
    }
}));

// Mock MotionModal
vi.mock('../../../src/components/common/MotionModal', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="motion-modal-wrapper">{children}</div>,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
    Upload: ({ className, ...props }: { className?: string;[key: string]: unknown }) => (
        <svg
            data-testid="upload-icon"
            className={className}
            {...props}
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
    ),
    X: ({ size, ...props }: { size?: number;[key: string]: unknown }) => (
        <svg
            data-testid="x-icon"
            width={size}
            height={size}
            {...props}
        >
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    ),
}));

// Mock URL.createObjectURL
const mockCreateObjectURL = vi.fn();
global.URL.createObjectURL = mockCreateObjectURL;

// Mock getElementById
const mockGetElementById = vi.fn();
global.document.getElementById = mockGetElementById;

describe('UploadImageModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    const defaultProps = {
        onClose: mockOnClose,
        onSubmit: mockOnSubmit,
        loading: false
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Create a mock file input element
        const mockFileInputElement = {
            click: vi.fn(),
            type: 'file',
            accept: 'image/jpeg, image/png',
            id: 'image-upload',
            className: 'hidden',
            getAttribute: vi.fn((attr: string) => {
                if (attr === 'type') return 'file';
                if (attr === 'accept') return 'image/jpeg, image/png';
                if (attr === 'id') return 'image-upload';
                return null;
            }),
            classList: {
                contains: vi.fn((className: string) => className === 'hidden')
            }
        };

        mockGetElementById.mockReturnValue(mockFileInputElement);
        mockCreateObjectURL.mockReturnValue('blob:mock-url');
    });

    it('renders modal with all required elements', () => {
        render(<UploadImageModal {...defaultProps} />);

        expect(screen.getByTestId('motion-modal-wrapper')).toBeInTheDocument();
        expect(screen.getByText('Upload Image')).toBeInTheDocument();
        expect(screen.getByText('Image')).toBeInTheDocument();
        expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
        expect(screen.getByText('PNG, JPG up to 10MB')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('displays close button with correct icon', () => {
        render(<UploadImageModal {...defaultProps} />);

        // Find the close button specifically by looking for the one with X icon
        const closeButton = screen.getByTestId('x-icon').closest('button');
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass('absolute', 'top-2', 'right-2', 'p-1');
        expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<UploadImageModal {...defaultProps} />);

        const closeButton = screen.getByTestId('x-icon').closest('button');
        fireEvent.click(closeButton!);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', () => {
        render(<UploadImageModal {...defaultProps} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('handles file input click when upload area is clicked', () => {
        render(<UploadImageModal {...defaultProps} />);

        const uploadArea = screen.getByText('Click to upload or drag and drop').closest('div');
        fireEvent.click(uploadArea!);

        expect(mockGetElementById).toHaveBeenCalledWith('image-upload');
        expect(mockGetElementById().click).toHaveBeenCalledTimes(1);
    });

    it('handles file upload via input change', async () => {
        render(<UploadImageModal {...defaultProps} />);

        const fileInputElement = document.querySelector('#image-upload') as HTMLInputElement;
        expect(fileInputElement).toBeInTheDocument();

        const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        // Create a change event with files using fireEvent.change with a custom event
        fireEvent.change(fileInputElement, {
            target: {
                files: [testFile]
            }
        });

        await waitFor(() => {
            expect(mockCreateObjectURL).toHaveBeenCalledWith(testFile);
        });

        // Check if preview appears
        await waitFor(() => {
            expect(screen.getByText('Preview')).toBeInTheDocument();
            expect(screen.getByRole('img')).toBeInTheDocument();
        });
    });

    it('handles drag and drop file upload', async () => {
        render(<UploadImageModal {...defaultProps} />);

        const uploadArea = screen.getByText('Click to upload or drag and drop').closest('div');
        const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        const dropEvent = new Event('drop', { bubbles: true });
        Object.defineProperty(dropEvent, 'dataTransfer', {
            value: {
                files: [testFile]
            }
        });

        fireEvent(uploadArea!, dropEvent);

        await waitFor(() => {
            expect(mockCreateObjectURL).toHaveBeenCalledWith(testFile);
        });

        // Check if preview appears
        await waitFor(() => {
            expect(screen.getByText('Preview')).toBeInTheDocument();
            expect(screen.getByRole('img')).toBeInTheDocument();
        });
    });

    it('handles drag over event', () => {
        render(<UploadImageModal {...defaultProps} />);

        const uploadArea = screen.getByText('Click to upload or drag and drop').closest('div');
        const dragOverEvent = new Event('dragover', { bubbles: true });
        const preventDefaultSpy = vi.spyOn(dragOverEvent, 'preventDefault');

        fireEvent(uploadArea!, dragOverEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('displays existing image preview when imageUrl prop is provided', () => {
        const propsWithImage = {
            ...defaultProps,
            imageUrl: 'https://example.com/existing-image.jpg'
        };

        render(<UploadImageModal {...propsWithImage} />);

        expect(screen.getByText('Preview')).toBeInTheDocument();
        const previewImage = screen.getByRole('img');
        expect(previewImage).toHaveAttribute('src', 'https://example.com/existing-image.jpg');
        expect(previewImage).toHaveAttribute('alt', 'Preview');
        expect(previewImage).toHaveClass('h-60', 'object-cover', 'rounded-lg');
    });

    it('submits without new image when submit is clicked without file upload', () => {
        render(<UploadImageModal {...defaultProps} />);

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith(null);
    });

    it('submits with uploaded file when submit is clicked after file upload', async () => {
        render(<UploadImageModal {...defaultProps} />);

        const fileInputElement = document.querySelector('#image-upload') as HTMLInputElement;
        const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

        fireEvent.change(fileInputElement, {
            target: {
                files: [testFile]
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Preview')).toBeInTheDocument();
        });

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        expect(mockOnSubmit).toHaveBeenCalledWith(testFile);
    });

    it('disables submit button when loading is true', () => {
        const loadingProps = {
            ...defaultProps,
            loading: true
        };

        render(<UploadImageModal {...loadingProps} />);

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveClass('bg-gray-400', 'opacity-50', 'cursor-not-allowed');
    });

    it('enables submit button when loading is false', () => {
        render(<UploadImageModal {...defaultProps} />);

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveClass('bg-blue-600');
    });

    it('has correct file input attributes', () => {
        render(<UploadImageModal {...defaultProps} />);

        const fileInputElement = document.querySelector('#image-upload');
        expect(fileInputElement).toBeInTheDocument();
        expect(fileInputElement).toHaveAttribute('type', 'file');
        expect(fileInputElement).toHaveAttribute('accept', 'image/jpeg, image/png');
        expect(fileInputElement).toHaveAttribute('id', 'image-upload');
        expect(fileInputElement).toHaveClass('hidden');
    });

    it('handles empty file list on input change', () => {
        render(<UploadImageModal {...defaultProps} />);

        const fileInputElement = document.querySelector('#image-upload') as HTMLInputElement;

        fireEvent.change(fileInputElement, {
            target: {
                files: []
            }
        });

        // Should not show preview for empty file list
        expect(screen.queryByText('Preview')).not.toBeInTheDocument();
        expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });

    it('handles empty dataTransfer files on drop', () => {
        render(<UploadImageModal {...defaultProps} />);

        const uploadArea = screen.getByText('Click to upload or drag and drop').closest('div');
        const dropEvent = new Event('drop', { bubbles: true });
        Object.defineProperty(dropEvent, 'dataTransfer', {
            value: {
                files: []
            }
        });

        fireEvent(uploadArea!, dropEvent);

        expect(screen.queryByText('Preview')).not.toBeInTheDocument();
        expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });

    it('prevents default on drop event', () => {
        render(<UploadImageModal {...defaultProps} />);

        const uploadArea = screen.getByText('Click to upload or drag and drop').closest('div');
        const dropEvent = new Event('drop', { bubbles: true });
        const preventDefaultSpy = vi.spyOn(dropEvent, 'preventDefault');

        Object.defineProperty(dropEvent, 'dataTransfer', {
            value: {
                files: [new File(['test'], 'test.jpg', { type: 'image/jpeg' })]
            }
        });

        fireEvent(uploadArea!, dropEvent);

        expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('handles null imageUrl prop', () => {
        const propsWithNullImage = {
            ...defaultProps,
            imageUrl: null
        };

        render(<UploadImageModal {...propsWithNullImage} />);

        expect(screen.queryByText('Preview')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('handles undefined imageUrl prop', () => {
        const propsWithUndefinedImage = {
            ...defaultProps,
            imageUrl: undefined
        };

        render(<UploadImageModal {...propsWithUndefinedImage} />);

        expect(screen.queryByText('Preview')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('has correct modal structure and styling', () => {
        render(<UploadImageModal {...defaultProps} />);

        const modalOverlay = screen.getByTestId('motion-modal-wrapper').firstChild;
        expect(modalOverlay).toHaveClass(
            'fixed',
            'inset-0',
            'bg-black',
            'bg-opacity-50',
            'flex',
            'items-center',
            'justify-center',
            'z-50'
        );

        const modalContent = screen.getByText('Upload Image').closest('div');
        expect(modalContent).toHaveClass(
            'bg-white',
            'rounded-lg',
            'shadow-lg',
            'w-full',
            'max-w-md',
            'p-6',
            'relative'
        );
    });

    it('has correct button styling', () => {
        render(<UploadImageModal {...defaultProps} />);

        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toHaveClass(
            'px-6',
            'py-2',
            'bg-gray-300',
            'text-gray-700',
            'rounded-lg',
            'hover:bg-gray-400'
        );

        const submitButton = screen.getByRole('button', { name: 'Submit' });
        expect(submitButton).toHaveClass(
            'px-6',
            'py-2',
            'bg-blue-600',
            'text-white',
            'rounded-lg',
            'hover:bg-blue-700',
            'transition-colors'
        );
    });

    it('maintains image state after multiple file selections', async () => {
        render(<UploadImageModal {...defaultProps} />);

        const fileInputElement = document.querySelector('#image-upload') as HTMLInputElement;

        // First file selection
        const firstFile = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
        fireEvent.change(fileInputElement, {
            target: {
                files: [firstFile]
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Preview')).toBeInTheDocument();
        });

        // Second file selection
        const secondFile = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
        fireEvent.change(fileInputElement, {
            target: {
                files: [secondFile]
            }
        });

        await waitFor(() => {
            expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);
        });

        // Submit should use the latest file
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).toHaveBeenCalledWith(secondFile);
    });
});
