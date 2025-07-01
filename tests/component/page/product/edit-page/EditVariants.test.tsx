import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import EditVariants from '../../../../../src/components/page/product/edit-page/EditVariants';
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

describe('EditVariants', () => {
    let productColorSizes: any[];
    let addedProductColorSizes: any[];
    let setProductColorSizes: any;
    let setAddedProductColorSizes: any;
    let handleSubmit: any;

    beforeEach(() => {
        productColorSizes = [defaultVariant];
        addedProductColorSizes = [];
        setProductColorSizes = vi.fn();
        setAddedProductColorSizes = vi.fn();
        handleSubmit = vi.fn();
        vi.clearAllMocks();
    });

    it('renders form fields and table', () => {
        render(
            <EditVariants
                productColorSizes={productColorSizes}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={addedProductColorSizes}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        expect(screen.getByText('editVariant')).toBeInTheDocument();
        expect(screen.getAllByText('color').length).toBeGreaterThan(0);
        expect(screen.getAllByText('size').length).toBeGreaterThan(0);
        expect(screen.getAllByText('quantity').length).toBeGreaterThan(0);
        expect(screen.getByText('add')).toBeInTheDocument();
        expect(screen.getByText('back')).toBeInTheDocument();
        expect(screen.getByText('submit')).toBeInTheDocument();
        expect(screen.getByText('Red')).toBeInTheDocument();
        expect(screen.getByText('M')).toBeInTheDocument();
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByTestId('icon-pencil')).toBeInTheDocument();
    });

    it('opens and selects color from ColorPickerDialog', () => {
        render(
            <EditVariants
                productColorSizes={[]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={[]}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        fireEvent.click(screen.getByPlaceholderText('Pick a color'));
        expect(screen.getByTestId('color-picker-dialog')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Pick Red'));
        expect(screen.queryByTestId('color-picker-dialog')).not.toBeInTheDocument();
    });

    it('opens and selects size from SizePickerDialog', () => {
        render(
            <EditVariants
                productColorSizes={[]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={[]}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        fireEvent.click(screen.getByPlaceholderText('Pick a size'));
        expect(screen.getByTestId('size-picker-dialog')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Pick M'));
        expect(screen.queryByTestId('size-picker-dialog')).not.toBeInTheDocument();
    });

    it('calls setAddedProductColorSizes when add is clicked with valid data', () => {
        render(
            <EditVariants
                productColorSizes={[]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={[]}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        // Pick color
        fireEvent.click(screen.getByPlaceholderText('Pick a color'));
        fireEvent.click(screen.getByText('Pick Red'));
        // Pick size
        fireEvent.click(screen.getByPlaceholderText('Pick a size'));
        fireEvent.click(screen.getByText('Pick M'));
        // Enter quantity
        fireEvent.change(screen.getByPlaceholderText('Enter quantity'), { target: { value: '5' } });
        // Click add
        fireEvent.click(screen.getByText('add'));
        expect(setAddedProductColorSizes).toHaveBeenCalled();
    });

    it('calls setProductColorSizes when save is clicked after editing old variant', () => {
        render(
            <EditVariants
                productColorSizes={[defaultVariant]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={[]}
                setAddedProductColorSizes={setAddedProductColorSizes}
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

    it('calls setAddedProductColorSizes when save is clicked after editing new variant', () => {
        render(
            <EditVariants
                productColorSizes={[]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={[defaultVariant]}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        // Click edit
        fireEvent.click(screen.getByTestId('icon-pencil').closest('button')!);
        // Change quantity
        fireEvent.change(screen.getByPlaceholderText('Enter quantity'), { target: { value: '20' } });
        // Click save
        fireEvent.click(screen.getByText('save'));
        expect(setAddedProductColorSizes).toHaveBeenCalled();
    });

    it('calls setAddedProductColorSizes when delete is clicked', () => {
        render(
            <EditVariants
                productColorSizes={[]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={[defaultVariant]}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        fireEvent.click(screen.getByTestId('icon-trash').closest('button')!);
        expect(setAddedProductColorSizes).toHaveBeenCalled();
    });

    it('calls handleSubmit when submit is clicked', () => {
        render(
            <EditVariants
                productColorSizes={[defaultVariant]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={[]}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        fireEvent.click(screen.getByText('submit'));
        expect(handleSubmit).toHaveBeenCalled();
    });

    it('navigates back when back is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(reactRouterDom, 'useNavigate').mockReturnValue(navigate);
        render(
            <EditVariants
                productColorSizes={[defaultVariant]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={false}
                addedProductColorSizes={[]}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        fireEvent.click(screen.getByText('back'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });

    it('disables submit button when loading', () => {
        render(
            <EditVariants
                productColorSizes={[defaultVariant]}
                setProductColorSizes={setProductColorSizes}
                handleSubmit={handleSubmit}
                loading={true}
                addedProductColorSizes={[]}
                setAddedProductColorSizes={setAddedProductColorSizes}
            />
        );
        expect(screen.getByText('submit')).toBeDisabled();
    });
});