import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryTable from '../../../src/components/category/CategoryTable';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { Category } from '../../../src/types/category/Category';

// Mock useNavigate globally
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return Object.assign({}, actual, {
        useNavigate: () => vi.fn(),
    });
});

// Mock DeleteConfirmationModal to just render its children
vi.mock('../../../src/components/common/DeleteConfirm', () => ({
    default: (props: any) =>
        props.isOpen ? (
            <div data-testid="delete-modal">
                <button onClick={props.onConfirm}>confirm</button>
                <button onClick={props.onClose}>close</button>
            </div>
        ) : null,
}));

// Mock API and toast
vi.mock('../../../src/apis/categoryApi', () => ({
    deleteCategory: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const { deleteCategory } = await import('../../../src/apis/categoryApi');
const { toast } = await import('react-toastify');

const categories: Category[] = [
    {
        id: '1',
        name: 'Cat 1',
        description: 'Desc 1',
        createdAt: '2023-01-01T00:00:00Z',
        createdBy: 'admin',
        updatedAt: '2023-01-02T00:00:00Z',
        updatedBy: 'admin'
    },
    {
        id: '2',
        name: 'Cat 2',
        description: 'Desc 2',
        createdAt: '2023-01-01T00:00:00Z',
        createdBy: 'admin',
        updatedAt: '2023-01-02T00:00:00Z',
        updatedBy: 'admin'
    },
];

describe('CategoryTable', () => {
    const refresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders category names and descriptions', () => {
        render(
            <MemoryRouter>
                <CategoryTable categories={categories} refresh={refresh} />
            </MemoryRouter>
        );
        expect(screen.getByText('Cat 1')).toBeInTheDocument();
        expect(screen.getByText('Cat 2')).toBeInTheDocument();
        expect(screen.getByText('Desc 1')).toBeInTheDocument();
        expect(screen.getByText('Desc 2')).toBeInTheDocument();
    });

    it('navigates to edit page on edit button click', async () => {
        const navigate = vi.fn();
        const routerDom = await import('react-router-dom');
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <MemoryRouter>
                <CategoryTable categories={categories} refresh={refresh} />
            </MemoryRouter>
        );
        const editButtons = screen.getAllByRole('button');
        fireEvent.click(editButtons[0]);
        expect(navigate).toHaveBeenCalled();
    });

    it('opens and closes delete confirmation modal', () => {
        render(
            <MemoryRouter>
                <CategoryTable categories={categories} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]); // First row's delete
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

        fireEvent.click(screen.getByText('close'));
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });

    it('calls deleteCategory, shows toast, and refreshes on confirm', async () => {
        (deleteCategory as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ isSuccess: true });
        render(
            <MemoryRouter>
                <CategoryTable categories={categories} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]);
        fireEvent.click(screen.getByText('confirm'));

        await waitFor(() => {
            expect(deleteCategory).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
            expect(refresh).toHaveBeenCalled();
        });
    });

    it('shows error toast on failed delete', async () => {
        (deleteCategory as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(
            <MemoryRouter>
                <CategoryTable categories={categories} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]);
        fireEvent.click(screen.getByText('confirm'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('renders empty state if no categories', () => {
        render(
            <MemoryRouter>
                <CategoryTable categories={[]} refresh={refresh} />
            </MemoryRouter>
        );
        expect(screen.queryByText('Cat 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Cat 2')).not.toBeInTheDocument();
    });
});