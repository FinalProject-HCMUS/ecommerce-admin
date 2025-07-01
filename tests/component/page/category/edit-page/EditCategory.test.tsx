import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import EditCategory from '../../../../../src/components/page/category/edit-page/EditCategory';

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
vi.mock('../../../../../src/apis/categoryApi', () => ({
    getCategoryById: vi.fn(),
    updateCategory: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

import * as categoryApi from '../../../../../src/apis/categoryApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('EditCategory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all fields and buttons', async () => {
        (categoryApi.getCategoryById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'CatName', description: 'CatDesc' },
        });
        render(<EditCategory />);
        await waitFor(() => {
            expect(screen.getByText('editCategory')).toBeInTheDocument();
            expect(screen.getByText('categoryName')).toBeInTheDocument();
            expect(screen.getByText('categoryDescripton')).toBeInTheDocument();
            expect(screen.getByText('cancel')).toBeInTheDocument();
            expect(screen.getByText('save')).toBeInTheDocument();
        });
    });

    it('loads category data on mount', async () => {
        (categoryApi.getCategoryById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'CatName', description: 'CatDesc' },
        });
        render(<EditCategory />);
        await waitFor(() => {
            expect(screen.getByDisplayValue('CatName')).toBeInTheDocument();
            expect(screen.getByDisplayValue('CatDesc')).toBeInTheDocument();
        });
    });

    it('shows error toast if getCategoryById fails', async () => {
        (categoryApi.getCategoryById as any).mockResolvedValueOnce({
            isSuccess: false,
            message: 'fail',
        });
        render(<EditCategory />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('shows error toast if fields are empty and save is clicked', async () => {
        (categoryApi.getCategoryById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: '', description: '' },
        });
        render(<EditCategory />);
        await waitFor(() => {
            fireEvent.click(screen.getByText('save'));
            expect(toast.error).toHaveBeenCalledWith('filledCondition', expect.any(Object));
        });
    });

    it('calls updateCategory and shows success toast on valid submit', async () => {
        (categoryApi.getCategoryById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'CatName', description: 'CatDesc' },
        });
        (categoryApi.updateCategory as any).mockResolvedValueOnce({ isSuccess: true });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<EditCategory />);
        await waitFor(() => {
            expect(screen.getByDisplayValue('CatName')).toBeInTheDocument();
        });
        fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), { target: { value: 'NewName' } });
        fireEvent.change(screen.getByPlaceholderText('descriptionPlaceholder'), { target: { value: 'NewDesc' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(categoryApi.updateCategory).toHaveBeenCalledWith('123', {
                name: 'NewName',
                description: 'NewDesc',
            });
            expect(toast.success).toHaveBeenCalledWith('updatedCategory', expect.objectContaining({
                autoClose: 1000,
                onClose: expect.any(Function),
            }));
        });
    });

    it('shows error toast if updateCategory fails', async () => {
        (categoryApi.getCategoryById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'CatName', description: 'CatDesc' },
        });
        (categoryApi.updateCategory as any).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(<EditCategory />);
        await waitFor(() => {
            expect(screen.getByDisplayValue('CatName')).toBeInTheDocument();
        });
        fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), { target: { value: 'NewName' } });
        fireEvent.change(screen.getByPlaceholderText('descriptionPlaceholder'), { target: { value: 'NewDesc' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to /categories when cancel is clicked', async () => {
        (categoryApi.getCategoryById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'CatName', description: 'CatDesc' },
        });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<EditCategory />);
        await waitFor(() => {
            expect(screen.getByDisplayValue('CatName')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith('/categories');
    });
});