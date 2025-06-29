import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SizePickerDialog from '../../../src/components/size/SizePickerDialog';
import React from 'react';
import { vi } from 'vitest';

// Mock getSizes API and toast
vi.mock('../../../src/apis/sizeApi', () => ({
    getSizes: vi.fn(),
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

const { getSizes } = await import('../../../src/apis/sizeApi');
const { toast } = await import('react-toastify');

const mockSizes = [
    { id: '1', name: 'S', minHeight: 150, maxHeight: 160, minWeight: 40, maxWeight: 50 },
    { id: '2', name: 'M', minHeight: 161, maxHeight: 170, minWeight: 51, maxWeight: 60 },
];

describe('SizePickerDialog', () => {
    const onClose = vi.fn();
    const onPick = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders nothing when closed', () => {
        render(
            <SizePickerDialog
                isOpen={false}
                onClose={onClose}
                onPick={onPick}
            />
        );
        expect(screen.queryByText('sizePicker')).not.toBeInTheDocument();
    });

    it('renders sizes when open', async () => {
        (getSizes as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: mockSizes, totalPages: 1 },
        });

        render(
            <SizePickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('S')).toBeInTheDocument();
            expect(screen.getByText('M')).toBeInTheDocument();
        });
    });

    it('calls onPick and onClose when a size is picked', async () => {
        (getSizes as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: mockSizes, totalPages: 1 },
        });

        render(
            <SizePickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('S')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('S'));
        await waitFor(() => {
            expect(onPick).toHaveBeenCalledWith(mockSizes[0]);
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('shows noSizeFound if no sizes', async () => {
        (getSizes as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });

        render(
            <SizePickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('noSizeFound')).toBeInTheDocument();
        });
    });

    it('shows error toast if API fails', async () => {
        (getSizes as any).mockResolvedValueOnce({
            isSuccess: false,
            message: 'fail',
        });

        render(
            <SizePickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
            />
        );

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', { autoClose: 1000 });
        });
    });

    it('calls onClose when close button is clicked', async () => {
        (getSizes as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { content: mockSizes, totalPages: 1 },
        });

        render(
            <SizePickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('S')).toBeInTheDocument();
        });

        // Use the first button, which should be the close button
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(onClose).toHaveBeenCalled();
    });

    it('can paginate', async () => {
        (getSizes as any).mockResolvedValue({
            isSuccess: true,
            data: { content: mockSizes, totalPages: 2 },
        });

        render(
            <SizePickerDialog
                isOpen={true}
                onClose={onClose}
                onPick={onPick}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('pagination')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('page2'));
        // Optionally, check if getSizes was called with page 2
    });
});