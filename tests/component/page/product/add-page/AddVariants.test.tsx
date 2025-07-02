import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AddVariants from '../../../../../src/components/page/product/add-page/AddVariants';
import * as reactRouterDom from 'react-router-dom';

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
vi.mock('react-toastify', () => ({
    toast: { error: vi.fn() }
}));
vi.mock('../../../../../src/components/color/ColorPickerDialog', () => ({
    __esModule: true,
    default: ({ isOpen, onPick, onClose }: any) =>
        isOpen ? (
            <div data-testid="color-picker-dialog">
                <button onClick={() => onPick({ id: 'c1', name: 'Red', code: '#ff0000' })}>Pick Red</button>
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}));
vi.mock('../../../../../src/components/size/SizePickerDialog', () => ({
    __esModule: true,
    default: ({ isOpen, onPick, onClose }: any) =>
        isOpen ? (
            <div data-testid="size-picker-dialog">
                <button onClick={() => onPick({ id: 's1', name: 'M', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 })}>Pick M</button>
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}));
vi.mock('lucide-react', () => ({
    Pencil: () => <svg data-testid="icon-pencil" />,
    Trash: () => <svg data-testid="icon-trash" />,
}));
vi.mock('../../../../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));

const defaultVariant = {
    id: '',
    productId: '',
    color: { id: 'c1', name: 'Red', code: '#ff0000' },
    size: { id: 's1', name: 'M', minHeight: 0, maxHeight: 0, minWeight: 0, maxWeight: 0 },
    quantity: 10,
};

describe('AddVariants', () => {
    let productColorSizes: any[];
    let setProductColorSizes: any;
    let handleSubmit: any;

    beforeEach(() => {
        productColorSizes = [defaultVariant];
        setProductColorSizes = vi.fn();
        handleSubmit = vi.fn();
        vi.clearAllMocks();
    });

    it('renders form fields and table', () => {
        render(
            <AddVariants
                productColorSizes={productColorSizes}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
            />
        );
        expect(screen.getAllByText('addVariant')[0]).toBeInTheDocument();
        expect(screen.getAllByText('color').length).toBeGreaterThan(1);
        expect(screen.getAllByText('size').length).toBeGreaterThan(1);
        expect(screen.getAllByText('quantity').length).toBeGreaterThan(1);
        expect(screen.getAllByText('add')[0]).toBeInTheDocument();
        expect(screen.getAllByText('back')[0]).toBeInTheDocument();
        expect(screen.getAllByText('submit')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Red')[0]).toBeInTheDocument();
        expect(screen.getAllByText('M')[0]).toBeInTheDocument();
        expect(screen.getAllByText('10')[0]).toBeInTheDocument();
        expect(screen.getAllByTestId('icon-pencil')[0]).toBeInTheDocument();
        expect(screen.getAllByTestId('icon-trash')[0]).toBeInTheDocument();
    });

    it('opens and selects color from ColorPickerDialog', () => {
        render(
            <AddVariants
                productColorSizes={[]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
            />
        );
        fireEvent.click(screen.getByPlaceholderText('pickaColor'));
        expect(screen.getByTestId('color-picker-dialog')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Pick Red'));
        // After pick, dialog should close and input should update
        expect(screen.queryByTestId('color-picker-dialog')).not.toBeInTheDocument();
    });

    it('opens and selects size from SizePickerDialog', () => {
        render(
            <AddVariants
                productColorSizes={[]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
            />
        );
        fireEvent.click(screen.getByPlaceholderText('pickaSize'));
        expect(screen.getByTestId('size-picker-dialog')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Pick M'));
        expect(screen.queryByTestId('size-picker-dialog')).not.toBeInTheDocument();
    });

    it('calls setProductColorSizes when add is clicked with valid data', () => {
        render(
            <AddVariants
                productColorSizes={[]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
            />
        );
        // Pick color
        fireEvent.click(screen.getByPlaceholderText('pickaColor'));
        fireEvent.click(screen.getByText('Pick Red'));
        // Pick size
        fireEvent.click(screen.getByPlaceholderText('pickaSize'));
        fireEvent.click(screen.getByText('Pick M'));
        // Enter quantity
        fireEvent.change(screen.getByPlaceholderText('Enter quantity'), { target: { value: '5' } });
        // Click add
        fireEvent.click(screen.getByText('add'));
        expect(setProductColorSizes).toHaveBeenCalled();
    });

    it('calls setProductColorSizes when save is clicked after editing', () => {
        render(
            <AddVariants
                productColorSizes={[defaultVariant]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
            />
        );
        // Click edit
        fireEvent.click(screen.getByTestId('icon-pencil').closest('button')!);
        // Change quantity
        fireEvent.change(screen.getByPlaceholderText('Enter quantity'), { target: { value: '20' } });
        // Click save
        fireEvent.click(screen.getByText('save'));
        expect(setProductColorSizes).toHaveBeenCalled();
    });

    it('calls setProductColorSizes when delete is clicked', () => {
        render(
            <AddVariants
                productColorSizes={[defaultVariant]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
            />
        );
        fireEvent.click(screen.getByTestId('icon-trash').closest('button')!);
        expect(setProductColorSizes).toHaveBeenCalled();
    });

    it('calls handleSubmit when submit is clicked', () => {
        render(
            <AddVariants
                productColorSizes={[defaultVariant]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
            />
        );
        fireEvent.click(screen.getByText('submit'));
        expect(handleSubmit).toHaveBeenCalled();
    });

    const navigate = vi.fn();
    vi.spyOn(reactRouterDom, 'useNavigate').mockReturnValue(navigate);
    render(
        <AddVariants
            productColorSizes={[defaultVariant]}
            setProductColorSizes={setProductColorSizes}
            handleSubmit={handleSubmit}
            loading={false}
        />
    );
    fireEvent.click(screen.getByText('back'));
    expect(navigate).toHaveBeenCalledWith(-1);
});