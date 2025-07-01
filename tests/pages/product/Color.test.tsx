import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as React from 'react';
import { vi } from 'vitest';
import Colors from '../../../src/pages/product/Color';

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
vi.mock('../../../src/components/color/ColorTable', () => ({
    __esModule: true,
    default: ({ colors }: any) => (
        <div data-testid="color-table">
            {colors.map((color: any) => (
                <div key={color.id}>
                    <span>{color.name}</span>
                </div>
            ))}
        </div>
    ),
}));
vi.mock('../../../src/apis/colorApi', () => ({
    getColors: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
    },
}));

import { getColors } from '../../../src/apis/colorApi';
import { toast } from 'react-toastify';

describe('Colors page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders color list and pagination', async () => {
        (getColors as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', name: 'Red' },
                    { id: '2', name: 'Blue' },
                ],
                totalPages: 2,
            },
        });
        render(<Colors />);
        expect(await screen.findByText('color')).toBeInTheDocument();
        expect(await screen.findByText('Red')).toBeInTheDocument();
        expect(screen.getByText('Blue')).toBeInTheDocument();
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });

    it('shows loading spinner while loading', async () => {
        let resolve: any;
        (getColors as any).mockImplementation(
            () => new Promise(res => { resolve = res; })
        );
        render(<Colors />);
        expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
        resolve({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        await waitFor(() => {
            expect(screen.getByTestId('color-table')).toBeInTheDocument();
        });
    });

    it('shows error toast if getColors fails', async () => {
        (getColors as any).mockResolvedValue({
            isSuccess: false,
            message: 'fail',
        });
        render(<Colors />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to add color page on add button click', async () => {
        (getColors as any).mockResolvedValue({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        render(<Colors />);
        const addBtn = await screen.findByText('addColor');
        fireEvent.click(addBtn);
        expect(mockNavigate).toHaveBeenCalledWith('/colors/add');
    });

    it('searches when pressing Enter in search input', async () => {
        (getColors as any).mockResolvedValue({
            isSuccess: true,
            data: { content: [], totalPages: 1 },
        });
        render(<Colors />);
        const input = screen.getByPlaceholderText('search');
        fireEvent.change(input, { target: { value: 'red' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        await waitFor(() => {
            expect(getColors).toHaveBeenCalled();
        });
    });

    it('changes page when clicking pagination', async () => {
        (getColors as any).mockResolvedValue({
            isSuccess: true,
            data: {
                content: [
                    { id: '1', name: 'Red' },
                ],
                totalPages: 2,
            },
        });
        render(<Colors />);
        await screen.findByText('Red');
        const nextBtn = screen.getByText('Next');
        fireEvent.click(nextBtn);
        await waitFor(() => {
            expect(getColors).toHaveBeenCalled();
        });
    });
});