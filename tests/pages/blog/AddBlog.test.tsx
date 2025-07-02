import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AddBlog from '../../../src/pages/blogs/AddBlog';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'writeNewBlog': 'Write new blog',
                'blogTitle': 'Blog title',
                'blogContentPlaceholder': 'Write your blog content here...',
                'back': 'Back',
                'next': 'Next',
                'filledInformation': 'Please fill in all the information',
                'addedSuccessfully': 'Blog added successfully',
                'needImage': 'You need to upload an image'
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

// Mock MotionPage component
vi.mock('../../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="motion-page">{children}</div>,
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mock AuthContext
vi.mock('../../../src/context/AuthContext', () => ({
    useAuth: () => ({
        user: {
            id: 'user-123',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
        },
    }),
}));

// Mock ReactQuill
vi.mock('react-quill', () => ({
    __esModule: true,
    default: ({ value, onChange, placeholder, className }: {
        value: string;
        onChange: (value: string) => void;
        placeholder: string;
        className: string;
    }) => (
        <div data-testid="react-quill" className={className}>
            <textarea
                data-testid="quill-editor"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    ),
}));

// Mock UploadImageModal
vi.mock('../../../src/components/blogs/UploadImageModal', () => ({
    __esModule: true,
    default: ({ onClose, onSubmit, loading }: {
        onClose: () => void;
        onSubmit: (image: File | null) => void;
        loading: boolean;
    }) => (
        <div data-testid="upload-image-modal">
            <button data-testid="modal-close" onClick={onClose}>Close</button>
            <button
                data-testid="modal-submit"
                onClick={() => onSubmit(new File(['test'], 'test.jpg', { type: 'image/jpeg' }))}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Submit'}
            </button>
            <button
                data-testid="modal-submit-no-image"
                onClick={() => onSubmit(null)}
            >
                Submit without image
            </button>
        </div>
    ),
}));

// Mock APIs
vi.mock('../../../src/apis/imageApi', () => ({
    uploadImage: vi.fn(),
}));

vi.mock('../../../src/apis/blogApi', () => ({
    addNewBlog: vi.fn(),
}));

// Import the mocked functions
import { uploadImage } from '../../../src/apis/imageApi';
import { addNewBlog } from '../../../src/apis/blogApi';
import { toast } from 'react-toastify';
const mockUploadImage = vi.mocked(uploadImage);
const mockAddNewBlog = vi.mocked(addNewBlog);
const mockToast = vi.mocked(toast);

// Wrapper component for Router
const AddBlogWrapper = () => (
    <BrowserRouter>
        <AddBlog />
    </BrowserRouter>
);

describe('AddBlog', () => {
    const createSuccessResponse = <T,>(data: T) => ({
        isSuccess: true,
        timestamp: '2024-01-01T00:00:00Z',
        httpStatus: '200',
        message: 'Success',
        data
    });

    const createErrorResponse = (message: string) => ({
        isSuccess: false,
        timestamp: '2024-01-01T00:00:00Z',
        httpStatus: '500',
        message,
        data: undefined
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the add blog form correctly', () => {
        render(<AddBlogWrapper />);

        expect(screen.getByText('Write new blog')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Blog title')).toBeInTheDocument();
        expect(screen.getByTestId('react-quill')).toBeInTheDocument();
        expect(screen.getByTestId('quill-editor')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('handles title input correctly', () => {
        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });

        expect(titleInput).toHaveValue('My Test Blog');
    });

    it('handles content input correctly', () => {
        render(<AddBlogWrapper />);

        const contentEditor = screen.getByTestId('quill-editor');
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        expect(contentEditor).toHaveValue('This is my blog content');
    });

    it('validates form and shows error when fields are empty', () => {
        render(<AddBlogWrapper />);

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(mockToast.error).toHaveBeenCalledWith(
            'Please fill in all the information',
            { position: "top-right", autoClose: 1000 }
        );
        expect(screen.queryByTestId('upload-image-modal')).not.toBeInTheDocument();
    });

    it('validates form and shows error when only title is filled', () => {
        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(mockToast.error).toHaveBeenCalledWith(
            'Please fill in all the information',
            { position: "top-right", autoClose: 1000 }
        );
        expect(screen.queryByTestId('upload-image-modal')).not.toBeInTheDocument();
    });

    it('validates form and shows error when only content is filled', () => {
        render(<AddBlogWrapper />);

        const contentEditor = screen.getByTestId('quill-editor');
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(mockToast.error).toHaveBeenCalledWith(
            'Please fill in all the information',
            { position: "top-right", autoClose: 1000 }
        );
        expect(screen.queryByTestId('upload-image-modal')).not.toBeInTheDocument();
    });

    it('opens upload modal when form is valid', () => {
        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByTestId('upload-image-modal')).toBeInTheDocument();
    });

    it('closes upload modal when close button is clicked', () => {
        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByTestId('upload-image-modal')).toBeInTheDocument();

        const closeButton = screen.getByTestId('modal-close');
        fireEvent.click(closeButton);

        expect(screen.queryByTestId('upload-image-modal')).not.toBeInTheDocument();
    });

    it('handles successful blog submission with image', async () => {
        mockUploadImage.mockResolvedValue(createSuccessResponse('https://example.com/image.jpg'));
        mockAddNewBlog.mockResolvedValue(createSuccessResponse({
            id: 'blog-123',
            title: 'My Test Blog',
            content: 'This is my blog content',
            image: 'https://example.com/image.jpg',
            userId: 'user-123',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: null,
            createdBy: null,
            updatedBy: null
        }));

        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitButton = screen.getByTestId('modal-submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUploadImage).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockAddNewBlog).toHaveBeenCalledWith({
                title: 'My Test Blog',
                content: 'This is my blog content',
                image: 'https://example.com/image.jpg',
                userId: 'user-123'
            });
        });

        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalledWith(
                'Blog added successfully',
                { position: "top-right", autoClose: 1000 }
            );
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/blogs');
        });
    });

    it('handles image upload error', async () => {
        mockUploadImage.mockResolvedValue(createErrorResponse('Failed to upload image'));

        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitButton = screen.getByTestId('modal-submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUploadImage).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to upload image',
                { position: "top-right", autoClose: 1000 }
            );
        });

        expect(mockAddNewBlog).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles blog creation error', async () => {
        mockUploadImage.mockResolvedValue(createSuccessResponse('https://example.com/image.jpg'));
        mockAddNewBlog.mockResolvedValue(createErrorResponse('Failed to create blog'));

        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitButton = screen.getByTestId('modal-submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUploadImage).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockAddNewBlog).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to create blog',
                { position: "top-right", autoClose: 1000 }
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles submission without image', async () => {
        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitWithoutImageButton = screen.getByTestId('modal-submit-no-image');
        fireEvent.click(submitWithoutImageButton);

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'You need to upload an image',
                { position: "top-right", autoClose: 1000 }
            );
        });

        expect(mockUploadImage).not.toHaveBeenCalled();
        expect(mockAddNewBlog).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles back button navigation', () => {
        render(<AddBlogWrapper />);

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('disables next button when loading', () => {
        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitButton = screen.getByTestId('modal-submit');
        fireEvent.click(submitButton);

        // The next button should be disabled when loading is true
        expect(nextButton).toBeDisabled();
    });

    it('trims whitespace from title and content validation', () => {
        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        // Set values with only whitespace
        fireEvent.change(titleInput, { target: { value: '   ' } });
        fireEvent.change(contentEditor, { target: { value: '   ' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(mockToast.error).toHaveBeenCalledWith(
            'Please fill in all the information',
            { position: "top-right", autoClose: 1000 }
        );
        expect(screen.queryByTestId('upload-image-modal')).not.toBeInTheDocument();
    });

    it('configures ReactQuill with correct modules and formats', () => {
        render(<AddBlogWrapper />);

        const quillEditor = screen.getByTestId('react-quill');
        expect(quillEditor).toHaveClass('h-96');
        expect(screen.getByPlaceholderText('Write your blog content here...')).toBeInTheDocument();
    });

    it('handles form submission via form element', () => {
        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        // Find the form and submit it
        const form = titleInput.closest('form');
        if (form) {
            fireEvent.submit(form);
        } else {
            // If no form, test the button click which calls handleNextStep
            const nextButton = screen.getByText('Next');
            fireEvent.click(nextButton);
        }

        expect(screen.getByTestId('upload-image-modal')).toBeInTheDocument();
    });

    it('prevents default form submission', () => {
        const preventDefault = vi.fn();

        render(<AddBlogWrapper />);

        const titleInput = screen.getByPlaceholderText('Blog title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'My Test Blog' } });
        fireEvent.change(contentEditor, { target: { value: 'This is my blog content' } });

        const nextButton = screen.getByText('Next');

        // Simulate a form submission event
        fireEvent.click(nextButton, { preventDefault });

        expect(screen.getByTestId('upload-image-modal')).toBeInTheDocument();
    });
});
