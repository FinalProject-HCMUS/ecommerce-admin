import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import EditSize from '../../../../../src/components/page/size/edit-page/EditSize';

// Mocks
vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
        useParams: () => ({ id: '123' }),
    };
});
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));
vi.mock('../../../../../src/apis/sizeApi', () => ({
    getSizeById: vi.fn(),
    updateSize: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

import * as sizeApi from '../../../../../src/apis/sizeApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('EditSize', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all fields and buttons with loaded data', async () => {
        (sizeApi.getSizeById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                id: '123',
                name: 'Size M',
                minHeight: 150,
                maxHeight: 170,
                minWeight: 50,
                maxWeight: 60,
            },
        });
        render(<EditSize />);
        expect(await screen.findByDisplayValue('Size M')).toBeInTheDocument();
        expect(screen.getByDisplayValue('150')).toBeInTheDocument();
        expect(screen.getByDisplayValue('170')).toBeInTheDocument();
        expect(screen.getByDisplayValue('50')).toBeInTheDocument();
        expect(screen.getByDisplayValue('60')).toBeInTheDocument();
        expect(screen.getByText('editSize')).toBeInTheDocument();
        expect(screen.getByText('nameSize')).toBeInTheDocument();
        expect(screen.getByText((c) => c.startsWith('minHeight'))).toBeInTheDocument();
        expect(screen.getByText((c) => c.startsWith('maxHeight'))).toBeInTheDocument();
        expect(screen.getByText((c) => c.startsWith('minWeight'))).toBeInTheDocument();
        expect(screen.getByText((c) => c.startsWith('maxWeight'))).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('save')).toBeInTheDocument();
    });

    it('shows error toast if getSizeById fails', async () => {
        (sizeApi.getSizeById as any).mockResolvedValueOnce({
            isSuccess: false,
            message: 'fail',
        });
        render(<EditSize />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('shows error toast if required fields are empty and save is clicked', async () => {
        (sizeApi.getSizeById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                id: '123',
                name: '',
                minHeight: 0,
                maxHeight: 0,
                minWeight: 0,
                maxWeight: 0,
            },
        });
        render(<EditSize />);
        await screen.findByDisplayValue('');
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('requiredFields', expect.any(Object));
        });
    });

    it('shows error toast if minHeight > maxHeight', async () => {
        (sizeApi.getSizeById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                id: '123',
                name: 'Size S',
                minHeight: 180,
                maxHeight: 170,
                minWeight: 50,
                maxWeight: 60,
            },
        });
        render(<EditSize />);
        await screen.findByDisplayValue('Size S');
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('invalidHeight', expect.any(Object));
        });
    });

    it('shows error toast if minWeight > maxWeight', async () => {
        (sizeApi.getSizeById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                id: '123',
                name: 'Size S',
                minHeight: 150,
                maxHeight: 170,
                minWeight: 70,
                maxWeight: 60,
            },
        });
        render(<EditSize />);
        await screen.findByDisplayValue('Size S');
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('invalidWeight', expect.any(Object));
        });
    });

    it('calls updateSize and shows success toast on valid submit', async () => {
        (sizeApi.getSizeById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                id: '123',
                name: 'Size S',
                minHeight: 150,
                maxHeight: 170,
                minWeight: 50,
                maxWeight: 60,
            },
        });
        (sizeApi.updateSize as any).mockResolvedValueOnce({ isSuccess: true });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<EditSize />);
        await screen.findByDisplayValue('Size S');
        fireEvent.change(screen.getByDisplayValue('Size S'), { target: { value: 'Size L' } });
        fireEvent.change(screen.getByDisplayValue('150'), { target: { value: '155' } });
        fireEvent.change(screen.getByDisplayValue('170'), { target: { value: '175' } });
        fireEvent.change(screen.getByDisplayValue('50'), { target: { value: '55' } });
        fireEvent.change(screen.getByDisplayValue('60'), { target: { value: '65' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(sizeApi.updateSize).toHaveBeenCalledWith('123', {
                name: 'Size L',
                minHeight: 155,
                maxHeight: 175,
                minWeight: 55,
                maxWeight: 65,
            });
            expect(toast.success).toHaveBeenCalledWith('updatedSize', expect.objectContaining({
                autoClose: 1000,
                onClose: expect.any(Function),
            }));
        });
    });

    it('shows error toast if updateSize fails', async () => {
        (sizeApi.getSizeById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                id: '123',
                name: 'Size S',
                minHeight: 150,
                maxHeight: 170,
                minWeight: 50,
                maxWeight: 60,
            },
        });
        (sizeApi.updateSize as any).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(<EditSize />);
        await screen.findByDisplayValue('Size S');
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to /sizes when cancel is clicked', async () => {
        (sizeApi.getSizeById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: {
                id: '123',
                name: 'Size S',
                minHeight: 150,
                maxHeight: 170,
                minWeight: 50,
                maxWeight: 60,
            },
        });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<EditSize />);
        await screen.findByDisplayValue('Size S');
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith('/sizes');
    });
});