import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';
import Categories from '../../src/pages/Categories';

// Mocks
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});
vi.mock('../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../src/components/category/CategoryTable', () => ({
    __esModule: true,
    default: ({ categories }: any) => (
        <div data-testid="category-table">
            {categories.map((cat: any) => (
                <div key={cat.id}>
                    <span>{cat.name}</span>
                    <span>{cat.description}</span>
                </div>
            ))}
        </div>
    ),
}));
vi.mock('../../src/components/common/Pagination', () => ({
    __esModule: true,
    default: ({ currentPage, totalPages, onPageChange }: any) => (
        <div data-testid="pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
    ),
}));
vi.mock('../../src/apis/categoryApi', () => ({
    getCategories: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

import { getCategories } from '../../src/apis/categoryApi';
import { toast } from 'react-toastify';

describe('Categories page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders category list and pagination', async () => {
        (getCategories as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', name: 'Cat 1', description: 'Desc 1' },
                    { id: '2', name: 'Cat 2', description: 'Desc 2' },
                ],
                totalPages: 2,
            },
        });
        render(<Categories />);
        expect(await screen.findByText('category')).toBeInTheDocument();
        expect(await screen.findByText('Cat 1')).toBeInTheDocument();
        expect(screen.getByText('Cat 2')).toBeInTheDocument();
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('shows loading spinner while loading', async () => {
        let resolve: any;
        (getCategories as any).mockImplementation(
            () => new Promise(res => { resolve = res; })
        );
        render(<Categories />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        resolve({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        await waitFor(() => {
            expect(screen.getByTestId('category-table')).toBeInTheDocument();
        });
    });

    it('shows error toast if getCategories fails', async () => {
        (getCategories as any).mockResolvedValue({
            isSuccess: false,
            message: 'fail',
        });
        render(<Categories />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to add category page on add button click', async () => {
        (getCategories as any).mockResolvedValue({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        const navigate = vi.fn();
        const routerDom = await import('react-router-dom');
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<Categories />);
        const addBtn = await screen.findByText('addCategory');
        fireEvent.click(addBtn);
        expect(navigate).toHaveBeenCalledWith('/categories/add');
    });

    it('searches when pressing Enter in search input', async () => {
        (getCategories as any).mockResolvedValue({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        render(<Categories />);
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'abc' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await waitFor(() => {
            expect(getCategories).toHaveBeenCalled();
        });
    });

    it('changes page when clicking pagination', async () => {
        (getCategories as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', name: 'Cat 1', description: 'Desc 1' },
                ],
                totalPages: 2,
            },
        });
        render(<Categories />);
        await screen.findByText('Cat 1');
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn);
        await waitFor(() => {
            expect(getCategories).toHaveBeenCalledWith(1, 10, '');
        });
    });
});