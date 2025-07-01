import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import { vi } from 'vitest';
import Sizes from '../../../src/pages/product/Size';

// Mocks
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});
vi.mock('../../../src/components/common/MotionPage', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('../../../src/components/common/Pagination', () => ({
    __esModule: true,
    default: ({ currentPage, totalPages, onPageChange }: any) => (
        <div data-testid="pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
            <span>{currentPage} / {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
    ),
}));
vi.mock('../../../src/components/size/SizeTable', () => ({
    __esModule: true,
    default: ({ sizes }: any) => (
        <div data-testid="size-table">
            {sizes.map((size: any) => (
                <div key={size.id}>
                    <span>{size.name}</span>
                </div>
            ))}
        </div>
    ),
}));
vi.mock('../../../src/apis/sizeApi', () => ({
    getSizes: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

import { getSizes } from '../../../src/apis/sizeApi';
import { toast } from 'react-toastify';

describe('Sizes page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders size list and pagination', async () => {
        (getSizes as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', name: 'S' },
                    { id: '2', name: 'M' },
                ],
                totalPages: 2,
            },
        });
        render(<Sizes />);
        expect(await screen.findByText('size')).toBeInTheDocument();
        expect(await screen.findByText('S')).toBeInTheDocument();
        expect(screen.getByText('M')).toBeInTheDocument();
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('shows loading spinner while loading', async () => {
        let resolve: any;
        (getSizes as any).mockImplementation(
            () => new Promise(res => { resolve = res; })
        );
        render(<Sizes />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        resolve({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        await waitFor(() => {
            expect(screen.getByTestId('size-table')).toBeInTheDocument();
        });
    });

    it('shows error toast if getSizes fails', async () => {
        (getSizes as any).mockResolvedValue({
            isSuccess: false,
            message: 'fail',
        });
        render(<Sizes />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to add size page on add button click', async () => {
        (getSizes as any).mockResolvedValue({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        render(<Sizes />);
        const addBtn = await screen.findByText('addSize');
        fireEvent.click(addBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/sizes/add');
    });

    it('searches when pressing Enter in search input', async () => {
        (getSizes as any).mockResolvedValue({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        render(<Sizes />);
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'XL' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await waitFor(() => {
            expect(getSizes).toHaveBeenCalled();
        });
    });

    it('changes page when clicking pagination', async () => {
        (getSizes as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', name: 'S' },
                ],
                totalPages: 2,
            },
        });
        render(<Sizes />);
        await screen.findByText('S');
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn);
        await waitFor(() => {
            expect(getSizes).toHaveBeenCalled();
        });
    });
});