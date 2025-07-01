import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import AddSize from '../../../../../src/components/page/size/add-page/AddSize';

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
    }),
}));
vi.mock('../../../../../src/apis/sizeApi', () => ({
    addSize: vi.fn(),
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

describe('AddSize', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all fields and buttons', () => {
        render(<AddSize />);
        expect(screen.getByText('addSize')).toBeInTheDocument();
        expect(screen.getByText('nameSize')).toBeInTheDocument();
        expect(screen.getByText((content) => content.startsWith('minHeight'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.startsWith('maxHeight'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.startsWith('minWeight'))).toBeInTheDocument();
        expect(screen.getByText((content) => content.startsWith('maxWeight'))).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('save')).toBeInTheDocument();
    });

    it('shows error toast if required fields are empty and save is clicked', () => {
        render(<AddSize />);
        fireEvent.click(screen.getByText('save'));
        expect(toast.error).toHaveBeenCalledWith('requiredFields', expect.any(Object));
    });

    it('shows error toast if minHeight > maxHeight', () => {
        render(<AddSize />);
        fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), { target: { value: 'Size S' } });
        fireEvent.change(screen.getByPlaceholderText('minHeightPlaceholder'), { target: { value: '180' } });
        fireEvent.change(screen.getByPlaceholderText('maxHeightPlaceholder'), { target: { value: '170' } });
        fireEvent.change(screen.getByPlaceholderText('minWeightPlaceholder'), { target: { value: '50' } });
        fireEvent.change(screen.getByPlaceholderText('maxWeightPlaceholder'), { target: { value: '60' } });
        fireEvent.click(screen.getByText('save'));
        expect(toast.error).toHaveBeenCalledWith('invalidHeight', expect.any(Object));
    });

    it('shows error toast if minWeight > maxWeight', () => {
        render(<AddSize />);
        fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), { target: { value: 'Size S' } });
        fireEvent.change(screen.getByPlaceholderText('minHeightPlaceholder'), { target: { value: '150' } });
        fireEvent.change(screen.getByPlaceholderText('maxHeightPlaceholder'), { target: { value: '170' } });
        fireEvent.change(screen.getByPlaceholderText('minWeightPlaceholder'), { target: { value: '70' } });
        fireEvent.change(screen.getByPlaceholderText('maxWeightPlaceholder'), { target: { value: '60' } });
        fireEvent.click(screen.getByText('save'));
        expect(toast.error).toHaveBeenCalledWith('invalidWeight', expect.any(Object));
    });

    it('calls addSize and shows success toast on valid submit', async () => {
        (sizeApi.addSize as any).mockResolvedValueOnce({ isSuccess: true });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<AddSize />);
        fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), { target: { value: 'Size S' } });
        fireEvent.change(screen.getByPlaceholderText('minHeightPlaceholder'), { target: { value: '150' } });
        fireEvent.change(screen.getByPlaceholderText('maxHeightPlaceholder'), { target: { value: '170' } });
        fireEvent.change(screen.getByPlaceholderText('minWeightPlaceholder'), { target: { value: '50' } });
        fireEvent.change(screen.getByPlaceholderText('maxWeightPlaceholder'), { target: { value: '60' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(sizeApi.addSize).toHaveBeenCalledWith({
                name: 'Size S',
                minHeight: 150,
                maxHeight: 170,
                minWeight: 50,
                maxWeight: 60,
            });
            expect(toast.success).toHaveBeenCalledWith('addedSize', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
                onClose: expect.any(Function),
            }));
        });
    });

    it('shows error toast if addSize fails', async () => {
        (sizeApi.addSize as any).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(<AddSize />);
        fireEvent.change(screen.getByPlaceholderText('namePlaceholder'), { target: { value: 'Size S' } });
        fireEvent.change(screen.getByPlaceholderText('minHeightPlaceholder'), { target: { value: '150' } });
        fireEvent.change(screen.getByPlaceholderText('maxHeightPlaceholder'), { target: { value: '170' } });
        fireEvent.change(screen.getByPlaceholderText('minWeightPlaceholder'), { target: { value: '50' } });
        fireEvent.change(screen.getByPlaceholderText('maxWeightPlaceholder'), { target: { value: '60' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('navigates to /sizes when cancel is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<AddSize />);
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith('/sizes');
    });
});