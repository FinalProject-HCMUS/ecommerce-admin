import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import AddColor from '../../../../../src/components/page/color/add-page/AddColor';

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
vi.mock('../../../../../src/apis/colorApi', () => ({
    addColor: vi.fn(),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

import * as colorApi from '../../../../../src/apis/colorApi';
import { toast } from 'react-toastify';
import * as routerDom from 'react-router-dom';

describe('AddColor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all fields and buttons', () => {
        render(<AddColor />);
        expect(screen.getByText('addColor')).toBeInTheDocument();
        expect(screen.getByText('colorName')).toBeInTheDocument();
        expect(screen.getByText('colorCode')).toBeInTheDocument();
        expect(screen.getByText('preview')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('save')).toBeInTheDocument();
    });

    it('shows error toast if fields are empty and save is clicked', () => {
        render(<AddColor />);
        fireEvent.change(screen.getByPlaceholderText('enterColorHolder'), { target: { value: '' } });
        fireEvent.click(screen.getByText('save'));
        expect(toast.error).toHaveBeenCalledWith('filledCondition', expect.objectContaining({
            autoClose: 1000,
            position: 'top-right',
        }));
    });

    it('calls addColor and shows success toast on valid submit', async () => {
        (colorApi.addColor as any).mockResolvedValueOnce({ isSuccess: true });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<AddColor />);
        fireEvent.change(screen.getByPlaceholderText('enterColorHolder'), { target: { value: 'Red' } });
        fireEvent.change(screen.getAllByDisplayValue('#000000')[0], { target: { value: '#FF0000' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(colorApi.addColor).toHaveBeenCalledWith({
                name: 'Red',
                code: '#ff0000', // <-- lowercase
            });
            expect(toast.success).toHaveBeenCalledWith('addColorSuccess', expect.objectContaining({
                autoClose: 1000,
                onClose: expect.any(Function),
            }));
        });
    });

    it('shows error toast if addColor fails', async () => {
        (colorApi.addColor as any).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(<AddColor />);
        fireEvent.change(screen.getByPlaceholderText('enterColorHolder'), { target: { value: 'Red' } });
        fireEvent.change(screen.getAllByDisplayValue('#000000')[0], { target: { value: '#FF0000' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.objectContaining({
                autoClose: 1000,
                position: 'top-right',
            }));
        });
    });

    it('navigates to /colors when cancel is clicked', () => {
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<AddColor />);
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith('/colors');
    });
});