import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Blogs from '../../../src/pages/blogs/Blogs';
import { Blog } from '../../../src/types/blog/blog';
import { BlogResponse } from '../../../src/types/blog/BlogResponse';

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
                'blogs': 'Blogs',
                'searchPlaceholder': 'Search blogs',
                'addBlog': 'Add Blog',
                'deleteBlog': 'Delete Blog'
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

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }: {
            children: React.ReactNode;
            className?: string;
            [key: string]: unknown;
        }) => <div className={className} {...props}>{children}</div>,
    },
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mock Pagination component
vi.mock('../../../src/components/common/Pagination', () => ({
    __esModule: true,
    default: ({ currentPage, totalPages, onPageChange }: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    }) => (
        <div data-testid="pagination">
            <span data-testid="current-page">{currentPage}</span>
            <span data-testid="total-pages">{totalPages}</span>
            <button
                data-testid="prev-page"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                Previous
            </button>
            <button
                data-testid="next-page"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                Next
            </button>
        </div>
    ),
}));

// Mock BlogCard component
vi.mock('../../../src/components/blogs/BlogCard', () => ({
    __esModule: true,
    default: ({ blog, onDelete }: { blog: Blog; onDelete: (blog: Blog) => void }) => (
        <div data-testid={`blog-card-${blog.id}`} className="blog-card">
            <h3 data-testid={`blog-title-${blog.id}`}>{blog.title}</h3>
            <p data-testid={`blog-content-${blog.id}`}>{blog.content}</p>
            <button
                data-testid={`delete-blog-${blog.id}`}
                onClick={() => onDelete(blog)}
            >
                Delete
            </button>
        </div>
    ),
}));

// Mock DeleteConfirmationModal component
vi.mock('../../../src/components/common/DeleteConfirm', () => ({
    __esModule: true,
    default: ({ title, isOpen, onClose, onConfirm, loading }: {
        title: string;
        isOpen: boolean;
        onClose: () => void;
        onConfirm: () => void;
        loading: boolean;
    }) => isOpen ? (
        <div data-testid="delete-confirmation-modal">
            <h3 data-testid="modal-title">{title}</h3>
            <button data-testid="modal-cancel" onClick={onClose}>Cancel</button>
            <button
                data-testid="modal-confirm"
                onClick={onConfirm}
                disabled={loading}
            >
                {loading ? 'Deleting...' : 'Confirm'}
            </button>
        </div>
    ) : null,
}));

// Mock blogApi
vi.mock('../../../src/apis/blogApi', () => ({
    getBlogs: vi.fn(),
    deleteBlog: vi.fn(),
}));

// Import the mocked functions
import { getBlogs, deleteBlog } from '../../../src/apis/blogApi';
import { toast } from 'react-toastify';
const mockGetBlogs = vi.mocked(getBlogs);
const mockDeleteBlog = vi.mocked(deleteBlog);
const mockToast = vi.mocked(toast);

// Wrapper component for Router
const BlogsWrapper = () => (
    <BrowserRouter>
        <Blogs />
    </BrowserRouter>
);

describe('Blogs', () => {
    const mockBlog1: Blog = {
        id: 'blog-1',
        title: 'First Blog Post',
        content: 'This is the content of the first blog post',
        image: 'https://example.com/image1.jpg',
        userId: 'user-1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: null,
        createdBy: null,
        updatedBy: null
    };

    const mockBlog2: Blog = {
        id: 'blog-2',
        title: 'Second Blog Post',
        content: 'This is the content of the second blog post',
        image: 'https://example.com/image2.jpg',
        userId: 'user-2',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: null,
        createdBy: null,
        updatedBy: null
    };

    const mockBlog3: Blog = {
        id: 'blog-3',
        title: 'Third Blog Post',
        content: 'This is the content of the third blog post',
        image: 'https://example.com/image3.jpg',
        userId: 'user-3',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: null,
        createdBy: null,
        updatedBy: null
    };

    const mockBlogResponse: BlogResponse = {
        content: [mockBlog1, mockBlog2, mockBlog3],
        pageable: {
            pageNumber: 0,
            pageSize: 6,
            sort: [],
            offset: 0,
            paged: true,
            unpaged: false
        },
        last: true,
        totalPages: 1,
        totalElements: 3,
        size: 6,
        number: 0,
        sort: [],
        first: true,
        numberOfElements: 3,
        empty: false
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
        // Reset all mocks to clear any previous implementations
        mockGetBlogs.mockReset();
        mockDeleteBlog.mockReset();
        mockNavigate.mockReset();
        vi.mocked(mockToast.error).mockReset();
        vi.mocked(mockToast.success).mockReset();

        // Set default mock implementations
        mockGetBlogs.mockResolvedValue(createSuccessResponse(mockBlogResponse));
        mockDeleteBlog.mockResolvedValue(createSuccessResponse(mockBlog1));
    });

    afterEach(() => {
        // Ensure mocks are properly reset after each test
        vi.clearAllMocks();
    });

    it('renders the blogs page correctly', async () => {
        render(<BlogsWrapper />);

        expect(screen.getByText('Blogs')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search blogs')).toBeInTheDocument();
        expect(screen.getByText('Add Blog')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId('blog-card-blog-1')).toBeInTheDocument();
            expect(screen.getByTestId('blog-card-blog-2')).toBeInTheDocument();
            expect(screen.getByTestId('blog-card-blog-3')).toBeInTheDocument();
        });
    });

    it('displays blog content correctly', async () => {
        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('blog-title-blog-1')).toHaveTextContent('First Blog Post');
            expect(screen.getByTestId('blog-content-blog-1')).toHaveTextContent('This is the content of the first blog post');
            expect(screen.getByTestId('blog-title-blog-2')).toHaveTextContent('Second Blog Post');
            expect(screen.getByTestId('blog-content-blog-2')).toHaveTextContent('This is the content of the second blog post');
        });
    });

    it('calls API on component mount', async () => {
        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(mockGetBlogs).toHaveBeenCalledWith(0, 6, "createdAt,asc", "");
        });
    });

    it('handles search functionality', async () => {
        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('blog-card-blog-1')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search blogs');
        fireEvent.change(searchInput, { target: { value: 'First Blog' } });

        expect(searchInput).toHaveValue('First Blog');

        // Clear previous calls and set up new mock response
        mockGetBlogs.mockClear();
        mockGetBlogs.mockResolvedValue(createSuccessResponse(mockBlogResponse));

        fireEvent.keyDown(searchInput, { key: 'Enter' });

        await waitFor(() => {
            expect(mockGetBlogs).toHaveBeenCalledWith(0, 6, "createdAt,asc", "First Blog");
        });
    });

    it('handles search with non-Enter key', async () => {
        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('blog-card-blog-1')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search blogs');
        fireEvent.change(searchInput, { target: { value: 'Search term' } });

        // Clear previous calls and simulate a different key press
        mockGetBlogs.mockClear();
        fireEvent.keyDown(searchInput, { key: 'Tab' });

        // Should not trigger a new search
        expect(mockGetBlogs).not.toHaveBeenCalled();
    });

    it('navigates to add blog page when add button is clicked', () => {
        render(<BlogsWrapper />);

        const addButton = screen.getByText('Add Blog');
        fireEvent.click(addButton);

        expect(mockNavigate).toHaveBeenCalledWith('/blogs/add');
    });

    it('handles pagination correctly', async () => {
        const multiPageResponse = {
            ...mockBlogResponse,
            totalPages: 2,
            last: false
        };

        mockGetBlogs.mockResolvedValue(createSuccessResponse(multiPageResponse));

        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('pagination')).toBeInTheDocument();
        });

        expect(screen.getByTestId('current-page')).toHaveTextContent('1');
        expect(screen.getByTestId('total-pages')).toHaveTextContent('2');

        // Click next page - ensure mock returns proper response
        mockGetBlogs.mockClear();
        mockGetBlogs.mockResolvedValue(createSuccessResponse(multiPageResponse));

        const nextButton = screen.getByTestId('next-page');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(mockGetBlogs).toHaveBeenCalledWith(1, 6, "createdAt,asc", "");
        });
    });

    it('opens delete confirmation modal when delete button is clicked', async () => {
        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('blog-card-blog-1')).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId('delete-blog-blog-1');
        fireEvent.click(deleteButton);

        expect(screen.getByTestId('delete-confirmation-modal')).toBeInTheDocument();
        expect(screen.getByTestId('modal-title')).toHaveTextContent('Delete Blog');
    });

    it('closes delete confirmation modal when cancel is clicked', async () => {
        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('blog-card-blog-1')).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId('delete-blog-blog-1');
        fireEvent.click(deleteButton);

        expect(screen.getByTestId('delete-confirmation-modal')).toBeInTheDocument();

        const cancelButton = screen.getByTestId('modal-cancel');
        fireEvent.click(cancelButton);

        expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument();
    });

    it('handles successful blog deletion', async () => {
        // Set up fresh mock responses
        mockDeleteBlog.mockResolvedValue(createSuccessResponse(mockBlog1));
        mockGetBlogs.mockResolvedValue(createSuccessResponse(mockBlogResponse));

        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('blog-card-blog-1')).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId('delete-blog-blog-1');
        fireEvent.click(deleteButton);

        const confirmButton = screen.getByTestId('modal-confirm');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteBlog).toHaveBeenCalledWith('blog-1');
        });

        await waitFor(() => {
            expect(mockToast.success).toHaveBeenCalledWith(
                'Blog deleted successfully!',
                { autoClose: 1000 }
            );
        });

        // Should refetch blogs after deletion
        await waitFor(() => {
            expect(mockGetBlogs).toHaveBeenCalledTimes(2); // Initial load + after deletion
        });

        // Modal should be closed
        expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument();
    });

    it('handles blog deletion error', async () => {
        mockDeleteBlog.mockRejectedValue(new Error('Delete failed'));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('blog-card-blog-1')).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId('delete-blog-blog-1');
        fireEvent.click(deleteButton);

        const confirmButton = screen.getByTestId('modal-confirm');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteBlog).toHaveBeenCalledWith('blog-1');
        });

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to delete blog. Please try again.'
            );
        });

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Failed to delete blog:', expect.any(Error));
        });

        // Modal should be closed even on error
        expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument();

        consoleSpy.mockRestore();
    });

    it('handles API error when fetching blogs', async () => {
        mockGetBlogs.mockResolvedValue(createErrorResponse('Failed to fetch blogs'));

        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(mockGetBlogs).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(mockToast.error).toHaveBeenCalledWith(
                'Failed to fetch blogs',
                { autoClose: 1000 }
            );
        });
    });

    it('handles empty blog response', async () => {
        const emptyResponse = {
            ...mockBlogResponse,
            content: [],
            totalElements: 0,
            numberOfElements: 0,
            empty: true
        };

        mockGetBlogs.mockResolvedValue(createSuccessResponse(emptyResponse));

        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(mockGetBlogs).toHaveBeenCalled();
        });

        // Should not display any blog cards
        expect(screen.queryByTestId('blog-card-blog-1')).not.toBeInTheDocument();
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
        expect(screen.getByTestId('total-pages')).toHaveTextContent('1');
    });

    it('resets page to 1 when performing search', async () => {
        const multiPageResponse = {
            ...mockBlogResponse,
            totalPages: 3,
            last: false
        };

        mockGetBlogs.mockResolvedValue(createSuccessResponse(multiPageResponse));

        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('pagination')).toBeInTheDocument();
        });

        // Go to page 2
        mockGetBlogs.mockClear();
        mockGetBlogs.mockResolvedValue(createSuccessResponse(multiPageResponse));

        const nextButton = screen.getByTestId('next-page');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByTestId('current-page')).toHaveTextContent('2');
        });

        // Perform search - ensure mock returns proper response
        mockGetBlogs.mockClear();
        mockGetBlogs.mockResolvedValue(createSuccessResponse(multiPageResponse));

        const searchInput = screen.getByPlaceholderText('Search blogs');
        fireEvent.change(searchInput, { target: { value: 'search term' } });
        fireEvent.keyDown(searchInput, { key: 'Enter' });

        // Should reset to page 1
        await waitFor(() => {
            expect(screen.getByTestId('current-page')).toHaveTextContent('1');
        });
    });

    it('disables confirm button when deletion is in progress', async () => {
        // Mock a slow delete operation that still returns proper structure
        mockDeleteBlog.mockImplementation(() =>
            new Promise(resolve =>
                setTimeout(() => resolve(createSuccessResponse(mockBlog1)), 1000)
            )
        );

        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('blog-card-blog-1')).toBeInTheDocument();
        });

        const deleteButton = screen.getByTestId('delete-blog-blog-1');
        fireEvent.click(deleteButton);

        const confirmButton = screen.getByTestId('modal-confirm');
        fireEvent.click(confirmButton);

        // Button should show loading state and be disabled
        expect(confirmButton).toHaveTextContent('Deleting...');
        expect(confirmButton).toBeDisabled();
    });

    it('handles pagination edge cases', async () => {
        const singlePageResponse = {
            ...mockBlogResponse,
            totalPages: 1,
            last: true,
            first: true
        };

        mockGetBlogs.mockResolvedValue(createSuccessResponse(singlePageResponse));

        render(<BlogsWrapper />);

        await waitFor(() => {
            expect(screen.getByTestId('pagination')).toBeInTheDocument();
        });

        const prevButton = screen.getByTestId('prev-page');
        const nextButton = screen.getByTestId('next-page');

        // Both buttons should be disabled on single page
        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });

    it('maintains search term state correctly', async () => {
        render(<BlogsWrapper />);

        const searchInput = screen.getByPlaceholderText('Search blogs');

        // Type in search input
        fireEvent.change(searchInput, { target: { value: 'test search' } });
        expect(searchInput).toHaveValue('test search');

        // Value should persist until Enter is pressed
        fireEvent.change(searchInput, { target: { value: 'updated search' } });
        expect(searchInput).toHaveValue('updated search');
    });
});
