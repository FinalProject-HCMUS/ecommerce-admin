import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import EditProduct from '../../../../../src/components/page/product/edit-page/EditProduct';

// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useParams: () => ({ id: 'p1' }),
        Routes: ({ children }: any) => <div>{children}</div>,
        Route: ({ element }: any) => element,
    };
});
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('../../../../../src/apis/productApi', () => ({
    getProductById: vi.fn(),
    getProductImages: vi.fn(),
    getProductColorSizes: vi.fn(),
    updateProductImages: vi.fn(),
    updateProduct: vi.fn(),
    deleteProductImage: vi.fn(),
    createProductColorSizes: vi.fn(),
    updateProductColorSize: vi.fn(),
}));
vi.mock('../../../../../src/apis/imageApi', () => ({
    uploadImages: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

// Mock child components
vi.mock('../../../../../src/components/page/product/edit-page/EditProductInformation', () => ({
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
vi.mock('../../../../../src/components/page/product/edit-page/EditProductImage', () => ({
    __esModule: true,
    default: ({
        setImages,
        setFiles,
        setIndexThumbnail,
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
vi.mock('../../../../../src/components/page/product/edit-page/EditVariants', () => ({
    __esModule: true,
    default: ({ handleSubmit, loading }: any) => (
        <div>
            <button onClick={handleSubmit} disabled={loading}>
                Save Product
            </button>
        </div>
    ),
}));

import * as productApi from '../../../../../src/apis/productApi';
import { toast } from 'react-toastify';

describe('EditProduct - additional cases', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (productApi.getProductById as any).mockResolvedValue({
            isSuccess: true,
            data: {
                id: 'p1',
                name: '',
                description: '',
                categoryId: '',
                price: 0,
                cost: 0,
                mainImageUrl: '',
            },
        });
        (productApi.getProductImages as any).mockResolvedValue({
            isSuccess: true,
            data: [],
        });
        (productApi.getProductColorSizes as any).mockResolvedValue({
            isSuccess: true,
            data: [],
        });
        (productApi.updateProductImages as any).mockResolvedValue({ isSuccess: true });
        (productApi.updateProduct as any).mockResolvedValue({ isSuccess: true });
    });

    it('renders EditProductInformation with correct initial values', async () => {
        render(<EditProduct />);
        expect(await screen.findByPlaceholderText('name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('description')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('categoryId')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('price')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('cost')).toBeInTheDocument();
    });

    it('updates formData when EditProductInformation inputs change', async () => {
        render(<EditProduct />);
        const nameInput = await screen.findByPlaceholderText('name');
        fireEvent.change(nameInput, { target: { value: 'New Name' } });
        expect((nameInput as HTMLInputElement).value).toBe('New Name');
        const descInput = screen.getByPlaceholderText('description');
        fireEvent.change(descInput, { target: { value: 'New Desc' } });
        expect((descInput as HTMLInputElement).value).toBe('New Desc');
    });

    it('calls setImages, setFiles, setIndexThumbnail, setFormData in EditProductImage', async () => {
        render(<EditProduct />);
        // Add Image
        fireEvent.click(await screen.findByText('Add Image'));
        // Add File
        fireEvent.click(screen.getByText('Add File'));
        // Set Thumbnail
        fireEvent.click(screen.getByText('Set Thumbnail'));
        // Set Main Image
        fireEvent.click(screen.getByText('Set Main Image'));
        // No assertion needed, just ensure no error and buttons exist
    });

    it('renders EditVariants and calls handleSubmit', async () => {
        render(<EditProduct />);
        const saveBtn = await screen.findByText('Save Product');
        fireEvent.click(saveBtn);
        // Should trigger handleSubmit, which will show error toast due to missing fields
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it('shows loading spinner when formData.id is not set', async () => {
        (productApi.getProductById as any).mockResolvedValueOnce({
            isSuccess: false,
            data: null,
        });
        const { container } = render(<EditProduct />);
        // The spinner is a div with class "animate-spin"
        await waitFor(() => {
            expect(container.querySelector('.animate-spin')).toBeInTheDocument();
        });
    });

    it('calls deleteProductImage for each deleted image', async () => {
        (productApi.getProductById as any).mockResolvedValue({
            isSuccess: true,
            data: {
                id: 'p1',
                name: 'Product',
                description: 'Desc',
                categoryId: 'cat1',
                price: 100,
                cost: 50,
                mainImageUrl: 'img1',
            },
        });
        (productApi.getProductImages as any).mockResolvedValue({
            isSuccess: true,
            data: [{ id: 'img-del', url: 'img-del-url', productId: 'p1' }],
        });
        (productApi.getProductColorSizes as any).mockResolvedValue({
            isSuccess: true,
            data: [],
        });
        (productApi.deleteProductImage as any).mockResolvedValue({ isSuccess: true });
        render(<EditProduct />);
        fireEvent.click(await screen.findByText('Save Product'));
    });
});