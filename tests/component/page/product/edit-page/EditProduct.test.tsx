import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

// Use vi.hoisted to ensure proper initialization order
const {
    mockNavigate,
    mockGetProductById,
    mockGetProductImages,
    mockGetProductColorSizes,
    mockUpdateProductImages,
    mockUpdateProduct,
    mockDeleteProductImage,
    mockCreateProductColorSizes,
    mockUpdateProductColorSize,
    mockUploadImages,
    mockToastError,
    mockToastSuccess
} = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
    mockGetProductById: vi.fn(),
    mockGetProductImages: vi.fn(),
    mockGetProductColorSizes: vi.fn(),
    mockUpdateProductImages: vi.fn(),
    mockUpdateProduct: vi.fn(),
    mockDeleteProductImage: vi.fn(),
    mockCreateProductColorSizes: vi.fn(),
    mockUpdateProductColorSize: vi.fn(),
    mockUploadImages: vi.fn(),
    mockToastError: vi.fn(),
    mockToastSuccess: vi.fn()
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'test-product-id' }),
    Routes: ({ children }: { children: React.ReactNode }) => <div data-testid="routes">{children}</div>,
    Route: ({ element }: { element: React.ReactElement }) => <div data-testid="route">{element}</div>,
}));

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                filledCondition: 'Please fill all required fields',
                editProductSuccess: 'Product updated successfully'
            };
            return translations[key] || key;
        }
    }),
}));

// Mock Product API
vi.mock('../../../../../src/apis/productApi', () => ({
    getProductById: mockGetProductById,
    getProductImages: mockGetProductImages,
    getProductColorSizes: mockGetProductColorSizes,
    updateProductImages: mockUpdateProductImages,
    updateProduct: mockUpdateProduct,
    deleteProductImage: mockDeleteProductImage,
    createProductColorSizes: mockCreateProductColorSizes,
    updateProductColorSize: mockUpdateProductColorSize,
}));

// Mock Image API
vi.mock('../../../../../src/apis/imageApi', () => ({
    uploadImages: mockUploadImages,
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
    toast: {
        error: mockToastError,
        success: mockToastSuccess,
    },
}));

interface FormData {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    price: number;
    cost: number;
    mainImageUrl: string;
}

interface ProductImage {
    id: string;
    url: string;
    productId: string;
}

// Mock child components with more realistic implementations
vi.mock('../../../../../src/components/page/product/edit-page/EditProductInformation', () => ({
    __esModule: true,
    default: ({ formData, setFormData }: { formData: FormData; setFormData: React.Dispatch<React.SetStateAction<FormData>> }) => (
        <div data-testid="edit-product-information">
            <input
                data-testid="product-name"
                placeholder="Product Name"
                value={formData.name || ''}
                onChange={e => setFormData((prev: FormData) => ({ ...prev, name: e.target.value }))}
            />
            <input
                data-testid="product-description"
                placeholder="Product Description"
                value={formData.description || ''}
                onChange={e => setFormData((prev: FormData) => ({ ...prev, description: e.target.value }))}
            />
            <input
                data-testid="product-category"
                placeholder="Category ID"
                value={formData.categoryId || ''}
                onChange={e => setFormData((prev: FormData) => ({ ...prev, categoryId: e.target.value }))}
            />
            <input
                data-testid="product-price"
                placeholder="Price"
                type="number"
                value={formData.price || 0}
                onChange={e => setFormData((prev: FormData) => ({ ...prev, price: Number(e.target.value) }))}
            />
            <input
                data-testid="product-cost"
                placeholder="Cost"
                type="number"
                value={formData.cost || 0}
                onChange={e => setFormData((prev: FormData) => ({ ...prev, cost: Number(e.target.value) }))}
            />
        </div>
    ),
}));

vi.mock('../../../../../src/components/page/product/edit-page/EditProductImage', () => ({
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
        setDeletedProductImages,
    }: {
        images: ProductImage[];
        setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
        files: File[];
        setFiles: React.Dispatch<React.SetStateAction<File[]>>;
        indexThumbnail: number;
        setIndexThumbnail: React.Dispatch<React.SetStateAction<number>>;
        formData: FormData;
        setFormData: React.Dispatch<React.SetStateAction<FormData>>;
        setDeletedProductImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
    }) => (
        <div data-testid="edit-product-image">
            <button
                data-testid="add-image-btn"
                onClick={() => setImages([...images, { id: '', url: 'new-image.jpg', productId: formData.id }])}
            >
                Add Image
            </button>
            <button
                data-testid="add-file-btn"
                onClick={() => setFiles([...files, new File([''], 'test.jpg', { type: 'image/jpeg' })])}
            >
                Add File
            </button>
            <button
                data-testid="set-thumbnail-btn"
                onClick={() => {
                    setIndexThumbnail(0);
                    setFormData((prev: FormData) => ({ ...prev, mainImageUrl: images[0]?.url || 'test-thumbnail.jpg' }));
                }}
            >
                Set Thumbnail
            </button>
            <button
                data-testid="delete-image-btn"
                onClick={() => {
                    if (images.length > 0) {
                        setDeletedProductImages([images[0]]);
                        setImages([]);
                    }
                }}
            >
                Delete Image
            </button>
            <div data-testid="images-count">{images.length}</div>
            <div data-testid="files-count">{files.length}</div>
            <div data-testid="thumbnail-index">{indexThumbnail}</div>
        </div>
    ),
}));

interface ProductColorSize {
    id: string;
    color: { id: string };
    size: { id: string };
    quantity: number;
}

vi.mock('../../../../../src/components/page/product/edit-page/EditVariants', () => ({
    __esModule: true,
    default: ({
        handleSubmit,
        loading,
        productColorSizes,
        setProductColorSizes,
        addedProductColorSizes,
        setAddedProductColorSizes
    }: {
        handleSubmit: () => Promise<void>;
        loading: boolean;
        productColorSizes: ProductColorSize[];
        setProductColorSizes: React.Dispatch<React.SetStateAction<ProductColorSize[]>>;
        addedProductColorSizes: ProductColorSize[];
        setAddedProductColorSizes: React.Dispatch<React.SetStateAction<ProductColorSize[]>>;
    }) => (
        <div data-testid="edit-variants">
            <button
                data-testid="save-product-btn"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Saving...' : 'Save Product'}
            </button>
            <button
                data-testid="add-variant-btn"
                onClick={() => setAddedProductColorSizes([
                    ...addedProductColorSizes,
                    { id: '', color: { id: 'color1' }, size: { id: 'size1' }, quantity: 10 }
                ])}
            >
                Add Variant
            </button>
            <button
                data-testid="update-variant-btn"
                onClick={() => setProductColorSizes([
                    ...productColorSizes,
                    { id: 'variant1', color: { id: 'color1' }, size: { id: 'size1' }, quantity: 5 }
                ])}
            >
                Update Variant
            </button>
            <div data-testid="variants-count">{productColorSizes.length}</div>
            <div data-testid="added-variants-count">{addedProductColorSizes.length}</div>
        </div>
    ),
}));

// Import components after mocks
import EditProduct from '../../../../../src/components/page/product/edit-page/EditProduct';

describe('EditProduct', () => {
    const mockProduct = {
        id: 'test-product-id',
        name: 'Test Product',
        description: 'Test Description',
        categoryId: 'cat1',
        price: 100,
        cost: 50,
        mainImageUrl: 'test-image.jpg',
    };

    const mockImages = [
        { id: 'img1', url: 'image1.jpg', productId: 'test-product-id' },
        { id: 'img2', url: 'image2.jpg', productId: 'test-product-id' },
    ];

    const mockProductColorSizes = [
        { id: 'pcs1', color: { id: 'color1' }, size: { id: 'size1' }, quantity: 10 },
        { id: 'pcs2', color: { id: 'color2' }, size: { id: 'size2' }, quantity: 5 },
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        // Set up default successful responses
        mockGetProductById.mockResolvedValue({
            isSuccess: true,
            data: mockProduct,
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });

        mockGetProductImages.mockResolvedValue({
            isSuccess: true,
            data: mockImages,
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });

        mockGetProductColorSizes.mockResolvedValue({
            isSuccess: true,
            data: mockProductColorSizes,
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });

        mockUpdateProductImages.mockResolvedValue({
            isSuccess: true,
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });

        mockUpdateProduct.mockResolvedValue({
            isSuccess: true,
            data: mockProduct,
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });

        mockDeleteProductImage.mockResolvedValue({
            isSuccess: true,
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });

        mockCreateProductColorSizes.mockResolvedValue({
            isSuccess: true,
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });

        mockUpdateProductColorSize.mockResolvedValue({
            isSuccess: true,
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });

        mockUploadImages.mockResolvedValue({
            isSuccess: true,
            data: ['uploaded-image1.jpg', 'uploaded-image2.jpg'],
            timestamp: new Date().toISOString(),
            httpStatus: 200,
            message: 'Success'
        });
    });

    describe('Component Rendering', () => {
        it('shows loading spinner when product data is not loaded', async () => {
            mockGetProductById.mockResolvedValueOnce({
                isSuccess: false,
                data: null,
                timestamp: new Date().toISOString(),
                httpStatus: 404,
                message: 'Product not found'
            });

            const { container } = render(<EditProduct />);

            await waitFor(() => {
                expect(container.querySelector('.animate-spin')).toBeInTheDocument();
            });
        });

        it('renders EditProductInformation with correct initial values', async () => {
            render(<EditProduct />);

            await waitFor(() => {
                expect(screen.getByTestId('edit-product-information')).toBeInTheDocument();
            });

            expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
            expect(screen.getByDisplayValue('cat1')).toBeInTheDocument();
            expect(screen.getByDisplayValue('100')).toBeInTheDocument();
            expect(screen.getByDisplayValue('50')).toBeInTheDocument();
        });

        it('renders EditProductImage component', async () => {
            render(<EditProduct />);

            await waitFor(() => {
                expect(screen.getByTestId('edit-product-image')).toBeInTheDocument();
            });
        });

        it('renders EditVariants component', async () => {
            render(<EditProduct />);

            await waitFor(() => {
                expect(screen.getByTestId('edit-variants')).toBeInTheDocument();
            });
        });
    });

    describe('Form Interactions', () => {
        it('updates formData when product information inputs change', async () => {
            render(<EditProduct />);

            const nameInput = await screen.findByTestId('product-name');
            fireEvent.change(nameInput, { target: { value: 'Updated Product Name' } });

            expect((nameInput as HTMLInputElement).value).toBe('Updated Product Name');

            const descInput = screen.getByTestId('product-description');
            fireEvent.change(descInput, { target: { value: 'Updated Description' } });

            expect((descInput as HTMLInputElement).value).toBe('Updated Description');

            const priceInput = screen.getByTestId('product-price');
            fireEvent.change(priceInput, { target: { value: '150' } });

            expect((priceInput as HTMLInputElement).value).toBe('150');
        });

        it('handles image operations', async () => {
            render(<EditProduct />);

            await waitFor(() => {
                expect(screen.getByTestId('edit-product-image')).toBeInTheDocument();
            });

            // Add image
            fireEvent.click(screen.getByTestId('add-image-btn'));

            // Add file
            fireEvent.click(screen.getByTestId('add-file-btn'));

            // Set thumbnail
            fireEvent.click(screen.getByTestId('set-thumbnail-btn'));

            // Delete image
            fireEvent.click(screen.getByTestId('delete-image-btn'));

            // These operations should not throw errors
            expect(screen.getByTestId('edit-product-image')).toBeInTheDocument();
        });

        it('handles variant operations', async () => {
            render(<EditProduct />);

            await waitFor(() => {
                expect(screen.getByTestId('edit-variants')).toBeInTheDocument();
            });

            // Add variant
            fireEvent.click(screen.getByTestId('add-variant-btn'));

            // Update variant
            fireEvent.click(screen.getByTestId('update-variant-btn'));

            expect(screen.getByTestId('edit-variants')).toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('handles product fetch error and navigates away', async () => {
            mockGetProductById.mockResolvedValueOnce({
                isSuccess: false,
                data: null,
                timestamp: new Date().toISOString(),
                httpStatus: 404,
                message: 'Product not found'
            });

            render(<EditProduct />);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Failed to fetch product data',
                    { autoClose: 1000, position: 'top-right' }
                );
                expect(mockNavigate).toHaveBeenCalledWith('/products');
            });
        });

        it('handles product images fetch error', async () => {
            mockGetProductImages.mockResolvedValueOnce({
                isSuccess: false,
                data: null,
                timestamp: new Date().toISOString(),
                httpStatus: 500,
                message: 'Failed to fetch images'
            });

            render(<EditProduct />);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Failed to fetch product images',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('handles product color sizes fetch error', async () => {
            mockGetProductColorSizes.mockResolvedValueOnce({
                isSuccess: false,
                data: null,
                timestamp: new Date().toISOString(),
                httpStatus: 500,
                message: 'Failed to fetch color sizes'
            });

            render(<EditProduct />);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Failed to fetch product color sizes',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('shows validation error when required fields are missing', async () => {
            // Set up empty product data
            mockGetProductById.mockResolvedValueOnce({
                isSuccess: true,
                data: {
                    id: 'test-product-id',
                    name: '',
                    description: '',
                    categoryId: '',
                    price: 0,
                    cost: 0,
                    mainImageUrl: '',
                },
                timestamp: new Date().toISOString(),
                httpStatus: 200,
                message: 'Success'
            });

            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Please fill all required fields',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('shows error when no images are present', async () => {
            mockGetProductImages.mockResolvedValueOnce({
                isSuccess: true,
                data: [],
                timestamp: new Date().toISOString(),
                httpStatus: 200,
                message: 'Success'
            });

            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Please add at least one image',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('shows error when no thumbnail is selected', async () => {
            // Set up product with empty mainImageUrl
            mockGetProductById.mockResolvedValueOnce({
                isSuccess: true,
                data: {
                    ...mockProduct,
                    mainImageUrl: '',
                },
                timestamp: new Date().toISOString(),
                httpStatus: 200,
                message: 'Success'
            });

            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Please select a thumbnail image',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('handles image upload error', async () => {
            mockUploadImages.mockResolvedValueOnce({
                isSuccess: false,
                data: null,
                timestamp: new Date().toISOString(),
                httpStatus: 500,
                message: 'Upload failed'
            });

            render(<EditProduct />);

            // Add a file to trigger upload
            fireEvent.click(await screen.findByTestId('add-file-btn'));

            const saveBtn = screen.getByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Upload failed',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('handles product images update error', async () => {
            mockUpdateProductImages.mockResolvedValueOnce({
                isSuccess: false,
                data: null,
                timestamp: new Date().toISOString(),
                httpStatus: 500,
                message: 'Failed to update images'
            });

            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Failed to update images',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('handles product update error', async () => {
            mockUpdateProduct.mockResolvedValueOnce({
                isSuccess: false,
                data: null,
                timestamp: new Date().toISOString(),
                httpStatus: 500,
                message: 'Failed to update product'
            });

            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Failed to update product',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('handles create product color sizes error', async () => {
            mockCreateProductColorSizes.mockResolvedValueOnce({
                isSuccess: false,
                data: null,
                timestamp: new Date().toISOString(),
                httpStatus: 500,
                message: 'Failed to create color sizes'
            });

            render(<EditProduct />);

            // Add a variant to trigger create API call
            fireEvent.click(await screen.findByTestId('add-variant-btn'));

            const saveBtn = screen.getByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Failed to create color sizes',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });
    });

    describe('Success Scenarios', () => {
        it('successfully saves product with all valid data', async () => {
            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockUpdateProductImages).toHaveBeenCalled();
                expect(mockUpdateProduct).toHaveBeenCalled();
                expect(mockToastSuccess).toHaveBeenCalledWith(
                    'Product updated successfully',
                    expect.objectContaining({
                        autoClose: 1000,
                        position: 'top-right',
                    })
                );
            });
        });

        it('successfully handles image upload and product update', async () => {
            render(<EditProduct />);

            // Add a file to trigger upload
            fireEvent.click(await screen.findByTestId('add-file-btn'));

            const saveBtn = screen.getByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockUploadImages).toHaveBeenCalled();
                expect(mockUpdateProductImages).toHaveBeenCalled();
                expect(mockUpdateProduct).toHaveBeenCalled();
                expect(mockToastSuccess).toHaveBeenCalled();
            });
        });

        it('successfully creates new product color sizes', async () => {
            render(<EditProduct />);

            // Add a variant
            fireEvent.click(await screen.findByTestId('add-variant-btn'));

            const saveBtn = screen.getByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockCreateProductColorSizes).toHaveBeenCalledWith([
                    {
                        productId: mockProduct.id,
                        colorId: 'color1',
                        sizeId: 'size1',
                        quantity: 10,
                    }
                ]);
                expect(mockToastSuccess).toHaveBeenCalled();
            });
        });

        it('successfully updates existing product color sizes', async () => {
            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockUpdateProductColorSize).toHaveBeenCalledTimes(mockProductColorSizes.length);
                expect(mockToastSuccess).toHaveBeenCalled();
            });
        });
    });

    describe('Loading States', () => {
        it('disables save button when loading', async () => {
            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            // Button should be disabled and show loading text
            expect(saveBtn).toBeDisabled();
        });

        it('shows loading text when saving', async () => {
            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(screen.getByText('Saving...')).toBeInTheDocument();
            });
        });
    });

    describe('Edge Cases', () => {
        it('handles empty product data gracefully', async () => {
            mockGetProductById.mockResolvedValueOnce({
                isSuccess: true,
                data: {
                    id: 'test-product-id',
                    name: '',
                    description: '',
                    categoryId: '',
                    price: 0,
                    cost: 0,
                    mainImageUrl: '',
                },
                timestamp: new Date().toISOString(),
                httpStatus: 200,
                message: 'Success'
            });

            mockGetProductImages.mockResolvedValueOnce({
                isSuccess: true,
                data: [],
                timestamp: new Date().toISOString(),
                httpStatus: 200,
                message: 'Success'
            });

            mockGetProductColorSizes.mockResolvedValueOnce({
                isSuccess: true,
                data: [],
                timestamp: new Date().toISOString(),
                httpStatus: 200,
                message: 'Success'
            });

            render(<EditProduct />);

            await waitFor(() => {
                expect(screen.getByTestId('edit-product-information')).toBeInTheDocument();
            });

            // Should handle empty inputs
            expect(screen.getByTestId('product-name')).toHaveValue('');
            expect(screen.getByTestId('product-description')).toHaveValue('');
            expect(screen.getByTestId('product-category')).toHaveValue('');
        });

        it('handles negative price validation', async () => {
            mockGetProductById.mockResolvedValueOnce({
                isSuccess: true,
                data: {
                    ...mockProduct,
                    price: -10,
                },
                timestamp: new Date().toISOString(),
                httpStatus: 200,
                message: 'Success'
            });

            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastError).toHaveBeenCalledWith(
                    'Please fill all required fields',
                    { autoClose: 1000, position: 'top-right' }
                );
            });
        });

        it('handles navigation on successful save', async () => {
            render(<EditProduct />);

            const saveBtn = await screen.findByTestId('save-product-btn');
            fireEvent.click(saveBtn);

            await waitFor(() => {
                expect(mockToastSuccess).toHaveBeenCalledWith(
                    'Product updated successfully',
                    expect.objectContaining({
                        onClose: expect.any(Function),
                    })
                );
            });

            // Simulate toast onClose callback
            const toastCall = mockToastSuccess.mock.calls[0];
            const options = toastCall[1];
            if (options?.onClose) {
                options.onClose();
            }

            expect(mockNavigate).toHaveBeenCalledWith('/products');
        });
    });
});