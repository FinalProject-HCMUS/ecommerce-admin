import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import AddCategory from '../../../../../src/components/page/category/add-page/AddCategory';
// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('../../../../../src/apis/categoryApi', () => ({
    addCategory: vi.fn(),
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

describe('AddCategory', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all fields and buttons', () => {
        render(<AddCategory />);
        expect(screen.getByText('addCategory')).toBeInTheDocument();
        expect(screen.getByText('categoryName')).toBeInTheDocument();
        expect(screen.getByText('categoryDescription')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('save')).toBeInTheDocument();
    });

    it('shows error toast if fields are empty and save is clicked', () => {
        render(<AddCategory />);
        fireEvent.click(screen.getByText('save'));
        expect(toast.error).toHaveBeenCalledWith('filledCondition', expect.any(Object));
    });

    it('calls addCategory and shows success toast on valid submit', async () => {
        (categoryApi.addCategory as any).mockResolvedValueOnce({ isSuccess: true });
        render(<AddCategory />);
        fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), { target: { value: 'Test Category' } });
        fireEvent.change(screen.getByPlaceholderText('descriptionPlaceholder'), { target: { value: 'Test Description' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(categoryApi.addCategory).toHaveBeenCalledWith({
                name: 'Test Category',
                description: 'Test Description',
            });
            expect(toast.success).toHaveBeenCalledWith('addedCategory', expect.objectContaining({
                autoClose: 1000,
                onClose: expect.any(Function),
            }));
        });
    });

    it('shows error toast if addCategory fails', async () => {
        (categoryApi.addCategory as any).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(<AddCategory />);
        fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), { target: { value: 'Test Category' } });
        fireEvent.change(screen.getByPlaceholderText('descriptionPlaceholder'), { target: { value: 'Test Description' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to /categories when cancel is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<AddCategory />);
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith('/categories');
    });
});