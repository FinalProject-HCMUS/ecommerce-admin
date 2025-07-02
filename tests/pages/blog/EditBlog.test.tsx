import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import EditBlog from '../../../src/pages/blogs/EditBlog';
import { Blog } from '../../../src/types/blog/blog';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: 'blog-123' }),
    };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'editBlog': 'Edit Blog',
                'blogTitle': 'Blog title',
                'blogContentPlaceholder': 'Write your blog content here...',
                'back': 'Back',
                'next': 'Next',
                'filledInformation': 'Please fill in all the information',
                'updatedSuccessfully': 'Blog updated successfully'
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
    default: ({ onClose, onSubmit, imageUrl, loading }: {
        onClose: () => void;
        onSubmit: (image: File | null) => void;
        imageUrl?: string | null;
        loading: boolean;
    }) => (
        <div data-testid="upload-image-modal">
            <div data-testid="current-image-url">{imageUrl || 'No image'}</div>
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
                Submit without new image
            </button>
        </div>
    ),
}));

// Mock APIs
vi.mock('../../../src/apis/imageApi', () => ({
    uploadImage: vi.fn(),
}));

vi.mock('../../../src/apis/blogApi', () => ({
    getBlogById: vi.fn(),
    updateBlog: vi.fn(),
}));

// Import the mocked functions
import { uploadImage } from '../../../src/apis/imageApi';
import { getBlogById, updateBlog } from '../../../src/apis/blogApi';
import { toast } from 'react-toastify';
const mockUploadImage = vi.mocked(uploadImage);
const mockGetBlogById = vi.mocked(getBlogById);
const mockUpdateBlog = vi.mocked(updateBlog);
const mockToast = vi.mocked(toast);

// Wrapper component for Router
const EditBlogWrapper = ({ blogId = 'blog-123' }: { blogId?: string }) => (
    <MemoryRouter initialEntries={[`/blogs/edit/${blogId}`]}>
        <EditBlog />
    </MemoryRouter>
);

describe('EditBlog', () => {
    const mockBlog: Blog = {
        id: 'blog-123',
        title: 'Existing Blog Title',
        content: 'Existing blog content that needs to be edited',
        image: 'https://example.com/existing-image.jpg',
        userId: 'user-123',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: null,
        createdBy: null,
        updatedBy: null
    };

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
        mockGetBlogById.mockResolvedValue(createSuccessResponse(mockBlog));
    });

    it('renders loading state initially', () => {
        mockGetBlogById.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<EditBlogWrapper />);

        expect(screen.getByText('Edit Blog')).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders the edit blog form correctly after loading', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        expect(screen.getByText('Edit Blog')).toBeInTheDocument();
        expect(screen.getByTestId('react-quill')).toBeInTheDocument();
        expect(screen.getByTestId('quill-editor')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('loads and displays existing blog data', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(mockGetBlogById).toHaveBeenCalledWith('blog-123');
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const contentEditor = screen.getByTestId('quill-editor');
        expect(contentEditor).toHaveValue('Existing blog content that needs to be edited');
    });

    it('handles API error when loading blog', async () => {
        mockGetBlogById.mockResolvedValue(createErrorResponse('Blog not found'));

        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(mockGetBlogById).toHaveBeenCalledWith('blog-123');
        });

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'Blog not found',
                { position: 'top-right', autoClose: 1000 }
            );
        });
    });

    it('handles title input changes', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const titleInput = screen.getByDisplayValue('Existing Blog Title');
        fireEvent.change(titleInput, { target: { value: 'Updated Blog Title' } });

        expect(titleInput).toHaveValue('Updated Blog Title');
    });

    it('handles content input changes', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            const contentEditor = screen.getByTestId('quill-editor');
            expect(contentEditor).toHaveValue('Existing blog content that needs to be edited');
        });

        const contentEditor = screen.getByTestId('quill-editor');
        fireEvent.change(contentEditor, { target: { value: 'Updated blog content' } });

        expect(contentEditor).toHaveValue('Updated blog content');
    });

    it('validates form and shows error when fields are empty', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const titleInput = screen.getByDisplayValue('Existing Blog Title');
        const contentEditor = screen.getByTestId('quill-editor');

        // Clear the fields
        fireEvent.change(titleInput, { target: { value: '' } });
        fireEvent.change(contentEditor, { target: { value: '' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(mockToast.error).toHaveBeenCalledWith(
            'Please fill in all the information',
            { position: 'top-right', autoClose: 1000 }
        );
        expect(screen.queryByTestId('upload-image-modal')).not.toBeInTheDocument();
    });

    it('validates form and shows error when only title is empty', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const titleInput = screen.getByDisplayValue('Existing Blog Title');
        fireEvent.change(titleInput, { target: { value: '' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(mockToast.error).toHaveBeenCalledWith(
            'Please fill in all the information',
            { position: 'top-right', autoClose: 1000 }
        );
    });

    it('validates form and shows error when only content is empty', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const contentEditor = screen.getByTestId('quill-editor');
        fireEvent.change(contentEditor, { target: { value: '' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(mockToast.error).toHaveBeenCalledWith(
            'Please fill in all the information',
            { position: 'top-right', autoClose: 1000 }
        );
    });

    it('opens upload modal when form is valid', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByTestId('upload-image-modal')).toBeInTheDocument();
        expect(screen.getByTestId('current-image-url')).toHaveTextContent('https://example.com/existing-image.jpg');
    });

    it('closes upload modal when close button is clicked', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByTestId('upload-image-modal')).toBeInTheDocument();

        const closeButton = screen.getByTestId('modal-close');
        fireEvent.click(closeButton);

        expect(screen.queryByTestId('upload-image-modal')).not.toBeInTheDocument();
    });

    it('handles successful blog update with new image', async () => {
        mockUploadImage.mockResolvedValue(createSuccessResponse('https://example.com/new-image.jpg'));
        mockUpdateBlog.mockResolvedValue(createSuccessResponse(mockBlog));

        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const titleInput = screen.getByDisplayValue('Existing Blog Title');
        const contentEditor = screen.getByTestId('quill-editor');

        fireEvent.change(titleInput, { target: { value: 'Updated Blog Title' } });
        fireEvent.change(contentEditor, { target: { value: 'Updated blog content' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitButton = screen.getByTestId('modal-submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUploadImage).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockUpdateBlog).toHaveBeenCalledWith('blog-123', {
                ...mockBlog,
                title: 'Updated Blog Title',
                content: 'Updated blog content',
                image: 'https://example.com/new-image.jpg',
                userId: 'user-123'
            });
        });

        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalledWith(
                'Blog updated successfully',
                { position: 'top-right', autoClose: 1000 }
            );
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/blogs');
        });
    });

    it('handles blog update without new image', async () => {
        mockUpdateBlog.mockResolvedValue(createSuccessResponse(mockBlog));

        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const titleInput = screen.getByDisplayValue('Existing Blog Title');
        fireEvent.change(titleInput, { target: { value: 'Updated Blog Title' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitWithoutImageButton = screen.getByTestId('modal-submit-no-image');
        fireEvent.click(submitWithoutImageButton);

        await waitFor(() => {
            expect(mockUpdateBlog).toHaveBeenCalledWith('blog-123', {
                ...mockBlog,
                title: 'Updated Blog Title',
                userId: 'user-123'
            });
        });

        expect(mockUploadImage).not.toHaveBeenCalled();

        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalledWith(
                'Blog updated successfully',
                { position: 'top-right', autoClose: 1000 }
            );
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/blogs');
        });
    });

    it('handles image upload error', async () => {
        mockUploadImage.mockResolvedValue(createErrorResponse('Failed to upload image'));

        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

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
                { position: 'top-right', autoClose: 1000 }
            );
        });

        expect(mockUpdateBlog).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles blog update error', async () => {
        mockUploadImage.mockResolvedValue(createSuccessResponse('https://example.com/new-image.jpg'));
        mockUpdateBlog.mockResolvedValue(createErrorResponse('Failed to update blog'));

        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitButton = screen.getByTestId('modal-submit');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockUploadImage).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockUpdateBlog).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to update blog',
                { position: 'top-right', autoClose: 1000 }
            );
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles back button navigation', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const backButton = screen.getByText('Back');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('disables next button when loading', async () => {
        // Mock a slow update operation
        mockUpdateBlog.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitButton = screen.getByTestId('modal-submit');
        fireEvent.click(submitButton);

        // The next button should be disabled when loading is true
        expect(nextButton).toBeDisabled();
        expect(nextButton).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('trims whitespace from title and content validation', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const titleInput = screen.getByDisplayValue('Existing Blog Title');
        const contentEditor = screen.getByTestId('quill-editor');

        // Set values with only whitespace
        fireEvent.change(titleInput, { target: { value: '   ' } });
        fireEvent.change(contentEditor, { target: { value: '   ' } });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(mockToast.error).toHaveBeenCalledWith(
            'Please fill in all the information',
            { position: 'top-right', autoClose: 1000 }
        );
        expect(screen.queryByTestId('upload-image-modal')).not.toBeInTheDocument();
    });

    it('configures ReactQuill with correct modules and formats', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const quillEditor = screen.getByTestId('react-quill');
        expect(quillEditor).toHaveClass('h-96');
        expect(screen.getByPlaceholderText('Write your blog content here...')).toBeInTheDocument();
    });

    it('prevents default form submission', async () => {
        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByTestId('upload-image-modal')).toBeInTheDocument();
    });

    it('handles blog without existing image', async () => {
        const blogWithoutImage = { ...mockBlog, image: '' };
        mockGetBlogById.mockResolvedValue(createSuccessResponse(blogWithoutImage));

        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByTestId('upload-image-modal')).toBeInTheDocument();
        expect(screen.getByTestId('current-image-url')).toHaveTextContent('No image');
    });

    it('displays loading spinner with correct role', () => {
        mockGetBlogById.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<EditBlogWrapper />);

        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('shows submit button loading state in modal', async () => {
        // Mock a slow update operation
        mockUpdateBlog.mockImplementation(() => new Promise(() => { })); // Never resolves

        render(<EditBlogWrapper />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Blog Title')).toBeInTheDocument();
        });

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        const submitButton = screen.getByTestId('modal-submit');
        fireEvent.click(submitButton);

        // Button should show loading state and be disabled
        expect(submitButton).toHaveTextContent('Loading...');
        expect(submitButton).toBeDisabled();
    });
});
