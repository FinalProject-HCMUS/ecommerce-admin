import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AddProductImage from '../../../../../src/components/page/product/add-page/AddProductImage';
import * as reactRouterDom from 'react-router-dom';

// Mock URL.createObjectURL for jsdom
beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
});

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
vi.mock('lucide-react', () => ({
    X: () => <svg data-testid="icon-x" />,
    Upload: () => <svg data-testid="icon-upload" />,
}));
vi.mock('../../../common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));

const baseProps = {
    files: [],
    setFiles: vi.fn(),
    indexThumbnail: 0,
    setIndexThumbnail: vi.fn(),
    images: [],
    setImages: vi.fn(),
    formData: {
        mainImageUrl: '',
        name: '',
        description: '',
        category: '',
        categoryId: '',
        categoryName: '',
        price: 0,
        cost: 0,
        discountPercent: 0,
        enable: false,
        inStock: false,
    },
    setFormData: vi.fn(),
};

describe('AddProductImage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders upload UI and navigation buttons', () => {
        render(<AddProductImage {...baseProps} />);
        expect(screen.getByText('productImage')).toBeInTheDocument();
        expect(screen.getByText('uploadImage')).toBeInTheDocument();
        expect(screen.getByText('back')).toBeInTheDocument();
        expect(screen.getByText('next')).toBeInTheDocument();
        expect(screen.getByTestId('icon-upload')).toBeInTheDocument();
    });

    it('renders thumbnail and product images if present', () => {
        const props = {
            ...baseProps,
            images: [
                { id: '1', productId: 'p1', url: 'img1.png' },
                { id: '2', productId: 'p1', url: 'img2.png' },
            ],
            formData: { ...baseProps.formData, mainImageUrl: 'img1.png' },
        };
        render(<AddProductImage {...props} />);
        expect(screen.getByAltText('Thumbnail')).toHaveAttribute('src', 'img1.png');
        expect(screen.getAllByRole('img').length).toBeGreaterThan(1);
    });

    it('calls setFiles, setImages, setFormData on file upload', () => {
        const setFiles = vi.fn();
        const setImages = vi.fn();
        const setFormData = vi.fn();
        render(
            <AddProductImage
                {...baseProps}
                setFiles={setFiles}
                setImages={setImages}
                setFormData={setFormData}
            />
        );
        // The input is hidden, but has id="image-upload"
        const input = document.getElementById('image-upload') as HTMLInputElement;
        expect(input).not.toBeNull();
        const file = new File(['dummy'], 'test.png', { type: 'image/png' });
        fireEvent.change(input, { target: { files: [file] } });
        expect(setFiles).toHaveBeenCalled();
        expect(setImages).toHaveBeenCalled();
        expect(setFormData).toHaveBeenCalled();
    });

    it('calls setIndexThumbnail and setFormData when a product image is clicked', () => {
        const setIndexThumbnail = vi.fn();
        const setFormData = vi.fn();
        const props = {
            ...baseProps,
            images: [
                { id: '1', productId: 'p1', url: 'img1.png' },
                { id: '2', productId: 'p1', url: 'img2.png' },
            ],
            formData: { ...baseProps.formData, mainImageUrl: 'img1.png' },
            setIndexThumbnail,
            setFormData,
        };
        render(<AddProductImage {...props} />);
        // The first image is the thumbnail, the second is a product image
        const imgs = screen.getAllByRole('img');
        fireEvent.click(imgs[1]);
        expect(setIndexThumbnail).toHaveBeenCalled();
        expect(setFormData).toHaveBeenCalled();
    });

    it('calls setFiles, setImages, setIndexThumbnail, setFormData when remove image is clicked', () => {
        const setFiles = vi.fn();
        const setImages = vi.fn();
        const setIndexThumbnail = vi.fn();
        const setFormData = vi.fn();
        const props = {
            ...baseProps,
            images: [
                { id: '1', productId: 'p1', url: 'img1.png' },
                { id: '2', productId: 'p1', url: 'img2.png' },
            ],
            formData: { ...baseProps.formData, mainImageUrl: 'img1.png' },
            setFiles,
            setImages,
            setIndexThumbnail,
            setFormData,
        };
        render(<AddProductImage {...props} />);
        // Find the remove button by icon-x
        const removeBtn = screen.getAllByRole('button').find(btn => btn.querySelector('[data-testid="icon-x"]'));
        fireEvent.click(removeBtn!);
        expect(setFiles).toHaveBeenCalled();
        expect(setImages).toHaveBeenCalled();
        expect(setIndexThumbnail).toHaveBeenCalled();
        expect(setFormData).toHaveBeenCalled();
    });

    it('navigates back when back button is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(reactRouterDom, 'useNavigate').mockReturnValue(navigate);
        render(<AddProductImage {...baseProps} />);
        fireEvent.click(screen.getByText('back'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });

    it('navigates next when next button is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(reactRouterDom, 'useNavigate').mockReturnValue(navigate);
        render(<AddProductImage {...baseProps} />);
        fireEvent.click(screen.getByText('next'));
        expect(navigate).toHaveBeenCalledWith('/products/add/variants');
    });
});