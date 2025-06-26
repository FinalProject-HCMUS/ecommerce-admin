import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ColorPickerDialog from '../../../src/components/color/ColorPickerDialog';
import React from 'react';
import { vi } from 'vitest';

// Mock getColors API and toast
vi.mock('../../../src/apis/colorApi', () => ({
    getColors: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Mock Pagination
vi.mock('../../../src/components/common/Pagination', () => ({
    __esModule: true,
    default: (props: any) => (
        <div data-testid="pagination">
            <button onClick={() => props.onPageChange(2)}>page2</button>
        </div>
    ),
}));

const { getColors } = await import('../../../src/apis/colorApi');
const { toast } = await import('react-toastify');

const mockColors = [
    { id: '1', name: 'Red', code: '#ff0000' },
    { id: '2', name: 'Green', code: '#00ff00' },
];

describe('ColorPickerDialog', () => {
    const onClose = vi.fn();
    const onPick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders nothing when closed', () => {
        render(
            <ColorPickerDialog
                isOpen={false}
                onClose={onClose}
                onPick={onPick}
                colorsSelected={[]}
            />
        );
        expect(screen.queryByText('colorPicker')).not.toBeInTheDocument();
    });

    it('renders colors when open', async () => {
        (getColors as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: mockColors, totalPages: 1 },
        });

        render(
            <ColorPickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
                colorsSelected={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Red')).toBeInTheDocument();
            expect(screen.getByText('Green')).toBeInTheDocument();
        });
    });

    it('calls onPick and onClose when a color is picked', async () => {
        (getColors as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: mockColors, totalPages: 1 },
        });

        render(
            <ColorPickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
                colorsSelected={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Red')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Red'));
        await waitFor(() => {
            expect(onPick).toHaveBeenCalledWith(mockColors[0]);
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('disables already selected colors', async () => {
        (getColors as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: mockColors, totalPages: 1 },
        });

        render(
            <ColorPickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
                colorsSelected={[mockColors[0]]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Red')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Red'));
        expect(onPick).not.toHaveBeenCalled();
    });

    it('shows noColorFound if no colors', async () => {
        (getColors as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });

        render(
            <ColorPickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
                colorsSelected={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('noColorFound')).toBeInTheDocument();
        });
    });

    it('shows error toast if API fails', async () => {
        (getColors as any).mockResolvedValueOnce({
            isSuccess: false,
            message: 'fail',
        });

        render(
            <ColorPickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
                colorsSelected={[]}
            />
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', { autoClose: 1000 });
        });
    });

    it('calls onClose when close button is clicked', async () => {
        (getColors as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: mockColors, totalPages: 1 },
        });

        render(
            <ColorPickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
                colorsSelected={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Red')).toBeInTheDocument();
        });

        // Use the first button, which should be the close button
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(onClose).toHaveBeenCalled();
    });

    it('can paginate', async () => {
        (getColors as any).mockResolvedValue({
            isSuccess: true,
            data: { content: mockColors, totalPages: 2 },
        });

        render(
            <ColorPickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
                colorsSelected={[]}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('pagination')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('page2'));
    });
});