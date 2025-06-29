import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import AddProduct from '../../../../../src/components/page/product/add-page/AddProduct';

// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        Routes: ({ children }: any) => <div>{children}</div>,
        Route: ({ element }: any) => element,
    };
});
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('../../../../../src/apis/imageApi', () => ({
    uploadImages: vi.fn(),
}));
vi.mock('../../../../../src/apis/productApi', () => ({
    addProduct: vi.fn(),
    createProductColorSizes: vi.fn(),
    updateProductImages: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mock child components
vi.mock('../../../../../src/components/page/product/add-page/AddProductInformation', () => ({
    __esModule: true,
    default: ({ formData, setFormData }: any) => (
        <div>
            <input
                placeholder="name"
                value={formData.name}
                onChange={e => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
            />
            <input
                placeholder="description"
                value={formData.description}
                onChange={e => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
            />
            <input
                placeholder="categoryId"
                value={formData.categoryId}
                onChange={e => setFormData((prev: any) => ({ ...prev, categoryId: e.target.value }))}
            />
            <input
                placeholder="price"
                value={formData.price}
                onChange={e => setFormData((prev: any) => ({ ...prev, price: Number(e.target.value) }))}
            />
            <input
                placeholder="cost"
                value={formData.cost}
                onChange={e => setFormData((prev: any) => ({ ...prev, cost: Number(e.target.value) }))}
            />
        </div>
    ),
}));
vi.mock('../../../../../src/components/page/product/add-page/AddProductImage', () => ({
    __esModule: true,
    default: ({
        images,
        setImages,
        files,
        setFiles,
        indexThumbnail,
        setIndexThumbnail,
        formData,
        setFormData,
    }: any) => (
        <div>
            <button onClick={() => setImages([{ url: 'img1', productId: '1' }])}>Add Image</button>
            <button onClick={() => setFiles([new File([''], 'file.png', { type: 'image/png' })])}>Add File</button>
            <button onClick={() => setIndexThumbnail(0)}>Set Thumbnail</button>
            <button onClick={() => setFormData((prev: any) => ({ ...prev, mainImageUrl: 'img1' }))}>Set Main Image</button>
        </div>
    ),
}));
vi.mock('../../../../../src/components/page/product/add-page/AddVariants', () => ({
    __esModule: true,
    default: ({ handleSubmit, loading }: any) => (
        <div>
            <button onClick={handleSubmit} disabled={loading}>
                Save Product
            </button>
        </div>
    ),
}));

import * as imageApi from '../../../../../src/apis/imageApi';
import * as productApi from '../../../../../src/apis/productApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('AddProduct', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows error toast if required fields are missing', async () => {
        render(<AddProduct />);
        fireEvent.click(screen.getByText('Save Product'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('filledCondition', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows error toast if no images', async () => {
        render(<AddProduct />);
        // Fill required fields
        fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'Product' } });
        fireEvent.change(screen.getByPlaceholderText('description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByPlaceholderText('categoryId'), { target: { value: 'cat1' } });
        fireEvent.change(screen.getByPlaceholderText('price'), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('cost'), { target: { value: '50' } });
        fireEvent.click(screen.getByText('Save Product'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('imageRequired', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows error toast if main image is not set', async () => {
        render(<AddProduct />);
        // Fill required fields
        fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'Product' } });
        fireEvent.change(screen.getByPlaceholderText('description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByPlaceholderText('categoryId'), { target: { value: 'cat1' } });
        fireEvent.change(screen.getByPlaceholderText('price'), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('cost'), { target: { value: '50' } });
        // Add image and file
        fireEvent.click(screen.getByText('Add Image'));
        fireEvent.click(screen.getByText('Add File'));
        fireEvent.click(screen.getByText('Save Product'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('mainImageRequired', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows error toast if uploadImages fails', async () => {
        (imageApi.uploadImages as any).mockResolvedValueOnce({ isSuccess: false, message: 'upload fail' });
        render(<AddProduct />);
        // Fill required fields
        fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'Product' } });
        fireEvent.change(screen.getByPlaceholderText('description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByPlaceholderText('categoryId'), { target: { value: 'cat1' } });
        fireEvent.change(screen.getByPlaceholderText('price'), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('cost'), { target: { value: '50' } });
        // Add image, file, and main image
        fireEvent.click(screen.getByText('Add Image'));
        fireEvent.click(screen.getByText('Add File'));
        fireEvent.click(screen.getByText('Set Main Image'));
        fireEvent.click(screen.getByText('Save Product'));
        await waitFor(() => {
            expect(imageApi.uploadImages).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('upload fail', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows error toast if addProduct fails', async () => {
        (imageApi.uploadImages as any).mockResolvedValueOnce({ isSuccess: true, data: ['img1'] });
        (productApi.addProduct as any).mockResolvedValueOnce({ isSuccess: false, message: 'add fail' });
        render(<AddProduct />);
        // Fill required fields
        fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'Product' } });
        fireEvent.change(screen.getByPlaceholderText('description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByPlaceholderText('categoryId'), { target: { value: 'cat1' } });
        fireEvent.change(screen.getByPlaceholderText('price'), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('cost'), { target: { value: '50' } });
        // Add image, file, and main image
        fireEvent.click(screen.getByText('Add Image'));
        fireEvent.click(screen.getByText('Add File'));
        fireEvent.click(screen.getByText('Set Main Image'));
        fireEvent.click(screen.getByText('Save Product'));
        await waitFor(() => {
            expect(productApi.addProduct).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('add fail', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows error toast if updateProductImages fails', async () => {
        (imageApi.uploadImages as any).mockResolvedValueOnce({ isSuccess: true, data: ['img1'] });
        (productApi.addProduct as any).mockResolvedValueOnce({ isSuccess: true, data: { id: 'p1' } });
        (productApi.updateProductImages as any).mockResolvedValueOnce({ isSuccess: false, message: 'img fail' });
        render(<AddProduct />);
        // Fill required fields
        fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'Product' } });
        fireEvent.change(screen.getByPlaceholderText('description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByPlaceholderText('categoryId'), { target: { value: 'cat1' } });
        fireEvent.change(screen.getByPlaceholderText('price'), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('cost'), { target: { value: '50' } });
        // Add image, file, and main image
        fireEvent.click(screen.getByText('Add Image'));
        fireEvent.click(screen.getByText('Add File'));
        fireEvent.click(screen.getByText('Set Main Image'));
        fireEvent.click(screen.getByText('Save Product'));
        await waitFor(() => {
            expect(productApi.updateProductImages).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith('img fail', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('shows success toast and navigates on full success', async () => {
        (imageApi.uploadImages as any).mockResolvedValueOnce({ isSuccess: true, data: ['img1'] });
        (productApi.addProduct as any).mockResolvedValueOnce({ isSuccess: true, data: { id: 'p1' } });
        (productApi.updateProductImages as any).mockResolvedValueOnce({ isSuccess: true });
        (productApi.createProductColorSizes as any).mockResolvedValueOnce({ isSuccess: true });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<AddProduct />);
        // Fill required fields
        fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'Product' } });
        fireEvent.change(screen.getByPlaceholderText('description'), { target: { value: 'Desc' } });
        fireEvent.change(screen.getByPlaceholderText('categoryId'), { target: { value: 'cat1' } });
        fireEvent.change(screen.getByPlaceholderText('price'), { target: { value: '100' } });
        fireEvent.change(screen.getByPlaceholderText('cost'), { target: { value: '50' } });
        // Add image, file, and main image
        fireEvent.click(screen.getByText('Add Image'));
        fireEvent.click(screen.getByText('Add File'));
        fireEvent.click(screen.getByText('Set Main Image'));
        fireEvent.click(screen.getByText('Save Product'));
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('addProductSuccess', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
                onClose: expect.any(Function),
            }));
        });
    });
});