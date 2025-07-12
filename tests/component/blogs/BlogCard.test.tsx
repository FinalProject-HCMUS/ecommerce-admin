import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import BlogCard from '../../../src/components/blogs/BlogCard';
import { Blog } from '../../../src/types/blog/blog';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, onClick, onHoverStart, onHoverEnd, ...props }: {
            children: React.ReactNode;
            className?: string;
            onClick?: () => void;
            onHoverStart?: () => void;
            onHoverEnd?: () => void;
            [key: string]: unknown;
        }) => (
            <div
                className={className}
                onClick={onClick}
                onMouseEnter={onHoverStart}
                onMouseLeave={onHoverEnd}
                data-testid="motion-div"
                {...props}
            >
                {children}
            </div>
        ),
    },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
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

// Wrapper component for Router
const BlogCardWrapper = ({ blog, onDelete }: { blog: Blog; onDelete: (blog: Blog) => void }) => (
    <BrowserRouter>
        <BlogCard blog={blog} onDelete={onDelete} />
    </BrowserRouter>
);

describe('BlogCard', () => {
    const mockBlog: Blog = {
        id: 'blog-123',
        title: 'Test Blog Title',
        content: '<p>This is a test blog content with <strong>HTML</strong> formatting.</p>',
        image: 'https://example.com/test-image.jpg',
        userId: 'user-123',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: null,
        createdBy: null,
        updatedBy: null
    };

    const mockOnDelete = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders blog card with all required elements', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        // Check if main elements are present
        expect(screen.getByTestId('motion-div')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete Blog' })).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByText('Test Blog Title')).toBeInTheDocument();
        expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('displays blog image correctly', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
        expect(image).toHaveAttribute('alt', 'Test Blog Title');
        expect(image).toHaveClass('w-full', 'rounded-lg', 'h-64', 'object-contain', 'cursor-pointer');
    });

    it('displays blog title correctly', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const title = screen.getByText('Test Blog Title');
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-800', 'mt-2');
    });

    it('displays blog content as HTML', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        // Check if the content is rendered with HTML
        const contentDiv = screen.getByText((content, element) => {
            return element?.innerHTML === '<p>This is a test blog content with <strong>HTML</strong> formatting.</p>';
        });
        expect(contentDiv).toBeInTheDocument();
        expect(contentDiv).toHaveClass('text-sm', 'text-gray-600', 'mt-2', 'line-clamp-3');
    });

    it('displays formatted creation date correctly', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        // The date should be formatted as "15 Jan 2024"
        const dateElement = screen.getByText('Jan 15, 2024');
        expect(dateElement).toBeInTheDocument();
        expect(dateElement).toHaveClass('text-sm', 'text-gray-500');
    });

    it('displays delete button with correct styling', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const deleteButton = screen.getByRole('button', { name: 'Delete Blog' });
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass(
            'absolute',
            'top-2',
            'right-2',
            'bg-red-500',
            'text-white',
            'rounded-full',
            'p-1',
            'hover:bg-red-600',
            'transition-colors',
            'cursor-pointer'
        );
    });

    it('calls onDelete when delete button is clicked', async () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const deleteButton = screen.getByRole('button', { name: 'Delete Blog' });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockOnDelete).toHaveBeenCalledTimes(1);
            expect(mockOnDelete).toHaveBeenCalledWith(mockBlog);
        });
    });

    it('navigates to edit page when image is clicked', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const image = screen.getByRole('img');
        fireEvent.click(image);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/blogs/edit/blog-123');
    });

    it('renders with correct motion component props', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const motionDiv = screen.getByTestId('motion-div');
        expect(motionDiv).toHaveClass(
            'relative',
            'bg-white',
            'rounded-lg',
            'shadow',
            'overflow-hidden',
            'hover:shadow-lg',
            'transition-shadow'
        );
    });

    it('handles blog with long title', () => {
        const blogWithLongTitle = {
            ...mockBlog,
            title: 'This is a very long blog title that might overflow the container and should be handled gracefully by the component styling'
        };
        render(<BlogCardWrapper blog={blogWithLongTitle} onDelete={mockOnDelete} />);

        const title = screen.getByText(blogWithLongTitle.title);
        expect(title).toBeInTheDocument();
        expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-800', 'mt-2');
    });

    it('handles blog with different date formats', () => {
        const blogWithDifferentDate = {
            ...mockBlog,
            createdAt: '2023-12-01T00:00:00Z'
        };
        render(<BlogCardWrapper blog={blogWithDifferentDate} onDelete={mockOnDelete} />);

        const dateElement = screen.getByText('Dec 1, 2023');
        expect(dateElement).toBeInTheDocument();
    });

    it('handles blog with complex HTML content', () => {
        const blogWithComplexContent = {
            ...mockBlog,
            content: '<div><h3>Heading</h3><p>Paragraph with <a href="#">link</a></p><ul><li>List item</li></ul></div>'
        };
        render(<BlogCardWrapper blog={blogWithComplexContent} onDelete={mockOnDelete} />);

        const contentDiv = screen.getByText((content, element) => {
            return element?.innerHTML === blogWithComplexContent.content;
        });
        expect(contentDiv).toBeInTheDocument();
    });

    it('handles missing or invalid image URL gracefully', () => {
        const blogWithInvalidImage = { ...mockBlog, image: '' };
        render(<BlogCardWrapper blog={blogWithInvalidImage} onDelete={mockOnDelete} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', '');
        expect(image).toHaveAttribute('alt', 'Test Blog Title');
    });

    it('delete button has correct accessibility attributes', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const deleteButton = screen.getByRole('button', { name: 'Delete Blog' });
        expect(deleteButton).toHaveAttribute('aria-label', 'Delete Blog');
    });

    it('image has correct accessibility attributes', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('alt', 'Test Blog Title');
    });

    it('handles null or undefined updatedAt gracefully', () => {
        const blogWithNullUpdatedAt = { ...mockBlog, updatedAt: null };
        render(<BlogCardWrapper blog={blogWithNullUpdatedAt} onDelete={mockOnDelete} />);

        // Should use createdAt for date display
        expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
    });

    it('X icon has correct size prop', () => {
        render(<BlogCardWrapper blog={mockBlog} onDelete={mockOnDelete} />);

        const xIcon = screen.getByTestId('x-icon');
        expect(xIcon).toHaveAttribute('width', '16');
        expect(xIcon).toHaveAttribute('height', '16');
    });
});

