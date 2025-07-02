import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ColorTable from '../../../src/components/color/ColorTable';
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
vi.mock('../../../src/apis/colorApi', () => ({
    deleteColor: vi.fn(),
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

const { deleteColor } = await import('../../../src/apis/colorApi');
const { toast } = await import('react-toastify');

const colors = [
    { id: '1', name: 'Red', code: '#ff0000' },
    { id: '2', name: 'Green', code: '#00ff00' },
];

describe('ColorTable', () => {
    const refresh = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders color names and codes', () => {
        render(
            <MemoryRouter>
                <ColorTable colors={colors} refresh={refresh} />
            </MemoryRouter>
        );
        expect(screen.getByText('Red')).toBeInTheDocument();
        expect(screen.getByText('Green')).toBeInTheDocument();
        expect(screen.getByText('#ff0000')).toBeInTheDocument();
        expect(screen.getByText('#00ff00')).toBeInTheDocument();
    });

    it('navigates to edit page on edit button click', async () => {
        const navigate = vi.fn();
        // Patch useNavigate to return our mock for this test
        const routerDom = await import('react-router-dom');
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(
            <MemoryRouter>
                <ColorTable colors={colors} refresh={refresh} />
            </MemoryRouter>
        );
        const editButtons = screen.getAllByRole('button');
        fireEvent.click(editButtons[0]);
        expect(navigate).toHaveBeenCalled();
    });

    it('opens and closes delete confirmation modal', () => {
        render(
            <MemoryRouter>
                <ColorTable colors={colors} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]); // First row's delete
        expect(screen.getByTestId('delete-modal')).toBeInTheDocument();

        fireEvent.click(screen.getByText('close'));
        expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });

    it('calls deleteColor, shows toast, and refreshes on confirm', async () => {
        (deleteColor as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ isSuccess: true });
        render(
            <MemoryRouter>
                <ColorTable colors={colors} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]);
        fireEvent.click(screen.getByText('confirm'));

        await waitFor(() => {
            expect(deleteColor).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
            expect(refresh).toHaveBeenCalled();
        });
    });

    it('shows error toast on failed delete', async () => {
        (deleteColor as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(
            <MemoryRouter>
                <ColorTable colors={colors} refresh={refresh} />
            </MemoryRouter>
        );
        const deleteButtons = screen.getAllByRole('button');
        fireEvent.click(deleteButtons[1]);
        fireEvent.click(screen.getByText('confirm'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('renders empty state if no colors', () => {
        render(
            <MemoryRouter>
                <ColorTable colors={[]} refresh={refresh} />
            </MemoryRouter>
        );
        expect(screen.queryByText('Red')).not.toBeInTheDocument();
        expect(screen.queryByText('Green')).not.toBeInTheDocument();
    });
});