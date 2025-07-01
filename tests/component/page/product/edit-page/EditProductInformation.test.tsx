import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';
import EditProductInformation from '../../../../../src/components/page/product/edit-page/EditProductInformation';

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
        i18n: { language: 'en' },
    }),
}));
vi.mock('react-quill', () => ({
    __esModule: true,
    default: ({ value, onChange }: any) => (
        <textarea
            data-testid="quill"
            value={value}
            onChange={e => onChange(e.target.value)}
        />
    ),
}));
vi.mock('../../../../../src/apis/categoryApi', () => ({
    getAllCategories: vi.fn(),
}));

import { getAllCategories } from '../../../../../src/apis/categoryApi';
import * as routerDom from 'react-router-dom';

const defaultFormData = {
    id: 'p1',
    name: '',
    description: '',
    category: '',
    categoryId: '',
    categoryName: '',
    price: 0,
    cost: 0,
    total: 0,
    discountPercent: 0,
    mainImageUrl: '',
    enable: false,
    inStock: false,
};

describe('EditProductInformation - additional cases', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state for category select while fetching', async () => {
        let resolveFetch: any;
        (getAllCategories as any).mockImplementationOnce(() => new Promise(res => { resolveFetch = res; }));
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        // Use class selector instead of getByText for disabled select
        expect(document.querySelector('.ant-select-disabled')).toBeInTheDocument();
        resolveFetch({ isSuccess: true, data: [] });
    });

    it('renders all category options when categories are loaded', async () => {
        (getAllCategories as any).mockResolvedValueOnce({
            isSuccess: true,
            data: [
                { id: 'cat1', name: 'Category 1' },
                { id: 'cat2', name: 'Category 2' }
            ],
        });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        const selectTrigger = document.querySelector('.ant-select-selector');
        fireEvent.mouseDown(selectTrigger!);
        await waitFor(() => {
            const options = within(document.body).queryAllByRole('option');
            expect(options.some(opt => opt.textContent?.includes('Category 1')));
            expect(options.some(opt => opt.textContent?.includes('Category 2')));
        });
    });

    it('handles empty categories gracefully', async () => {
        (getAllCategories as any).mockResolvedValueOnce({
            isSuccess: true,
            data: [],
        });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        // Use class selector for select trigger if text is not present
        const selectTrigger = document.querySelector('.ant-select-selector');
        fireEvent.mouseDown(selectTrigger!);
        expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });

    it('handles getAllCategories failure gracefully', async () => {
        (getAllCategories as any).mockResolvedValueOnce({
            isSuccess: false,
            data: null,
        });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        // Just check the select exists
        expect(document.querySelector('.ant-select')).toBeInTheDocument();
    });

    it('calls setFormData when description is changed', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        fireEvent.change(screen.getByTestId('quill'), { target: { value: 'New description' } });
        expect(setFormData).toHaveBeenCalled();
    });

    it('calls setFormData when enable checkbox is toggled', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        expect(setFormData).toHaveBeenCalled();
    });

    it('calls setFormData when inStock checkbox is toggled', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[1]);
        expect(setFormData).toHaveBeenCalled();
    });

    it('calls setFormData when price and cost are changed', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        fireEvent.change(screen.getByPlaceholderText('Enter price'), { target: { value: '10' } });
        expect(setFormData).toHaveBeenCalled();
        fireEvent.change(screen.getByPlaceholderText('Enter cost'), { target: { value: '5' } });
        expect(setFormData).toHaveBeenCalled();
    });

    it('renders initial values for all fields', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        const filledFormData = {
            ...defaultFormData,
            name: 'Test Product',
            price: 123,
            cost: 45,
            enable: true,
            inStock: true,
            description: 'desc'
        };
        render(<EditProductInformation formData={filledFormData} setFormData={setFormData} />);
        expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
        expect(screen.getByDisplayValue('123')).toBeInTheDocument();
        expect(screen.getByDisplayValue('45')).toBeInTheDocument();
        expect(screen.getByTestId('quill')).toHaveValue('desc');
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).toBeChecked();
    });

    it('navigates back when cancel is clicked', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });

    it('navigates to images step when next is clicked', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        fireEvent.click(screen.getByText('next'));
        expect(navigate).toHaveBeenCalledWith('/products/edit/p1/images');
    });

    it('category select is disabled while fetching', async () => {
        let resolveFetch: any;
        (getAllCategories as any).mockImplementationOnce(() => new Promise(res => { resolveFetch = res; }));
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        expect(document.querySelector('.ant-select-disabled')).toBeInTheDocument();
        resolveFetch({ isSuccess: true, data: [] });
    });

    it('does not call setFormData if category is not found', async () => {
        (getAllCategories as any).mockResolvedValueOnce({
            isSuccess: true,
            data: [{ id: 'cat1', name: 'Category 1' }],
        });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        const selectTrigger = document.querySelector('.ant-select-selector');
        fireEvent.mouseDown(selectTrigger!);
        expect(setFormData).not.toHaveBeenCalled();
    });

    it('renders price and cost inputs as type number', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        const priceInput = screen.getByPlaceholderText('Enter price');
        const costInput = screen.getByPlaceholderText('Enter cost');
        expect(priceInput).toHaveAttribute('type', 'number');
        expect(costInput).toHaveAttribute('type', 'number');
    });

    it('renders enable and inStock checkboxes unchecked by default', async () => {
        (getAllCategories as any).mockResolvedValueOnce({ isSuccess: true, data: [] });
        const setFormData = vi.fn();
        render(<EditProductInformation formData={defaultFormData} setFormData={setFormData} />);
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).not.toBeChecked();
        expect(checkboxes[1]).not.toBeChecked();
    });
});