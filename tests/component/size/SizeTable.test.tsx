import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SizeTable from '../../../src/components/size/SizeTable';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

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
vi.mock('../../../src/apis/sizeApi', () => ({
    deleteSize: vi.fn(),
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

const { deleteSize } = await import('../../../src/apis/sizeApi');
const { toast } = await import('react-toastify');

const sizes = [
    { id: '1', name: 'S', minHeight: 150, maxHeight: 160, minWeight: 40, maxWeight: 50 },
    { id: '2', name: 'M', minHeight: 161, maxHeight: 170, minWeight: 51, maxWeight: 60 },
];

describe('SizeTable', () => {
    const refresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders size names and values', () => {
        render(
            <MemoryRouter>
                <SizeTable sizes={sizes} refresh={refresh} />
            </MemoryRouter>
        );
        expect(screen.getByText('S')).toBeInTheDocument();
        expect(screen.getByText('M')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('170')).toBeInTheDocument();
        expect(screen.getByText('40')).toBeInTheDocument();
        expect(screen.getByText('60')).toBeInTheDocument();
    });

    it('navigates to edit page on edit button click', async () => {
        const navigate = vi.fn();
        const routerDom = await import('react-router-dom');
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <MemoryRouter>
                <SizeTable sizes={sizes} refresh={refresh} />
            </MemoryRouter>
        );
        const editButtons = screen.getAllByRole('button');
        fireEvent.click(editButtons[0]);
        expect(navigate).toHaveBeenCalled();
    });

    it('opens and closes delete confirmation modal', () => {
        render(
            <MemoryRouter>
                <SizeTable sizes={sizes} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]); // First row's delete
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

        fireEvent.click(screen.getByText('close'));
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });

    it('calls deleteSize, shows toast, and refreshes on confirm', async () => {
        (deleteSize as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ isSuccess: true });
        render(
            <MemoryRouter>
                <SizeTable sizes={sizes} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]);
        fireEvent.click(screen.getByText('confirm'));

        await waitFor(() => {
            expect(deleteSize).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
            expect(refresh).toHaveBeenCalled();
        });
    });

    it('shows error toast on failed delete', async () => {
        (deleteSize as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(
            <MemoryRouter>
                <SizeTable sizes={sizes} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]);
        fireEvent.click(screen.getByText('confirm'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('renders empty state if no sizes', () => {
        render(
            <MemoryRouter>
                <SizeTable sizes={[]} refresh={refresh} />
            </MemoryRouter>
        );
        expect(screen.queryByText('S')).not.toBeInTheDocument();
        expect(screen.queryByText('M')).not.toBeInTheDocument();
    });
});