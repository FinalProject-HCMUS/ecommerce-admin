import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import EditColor from '../../../../../src/components/page/color/edit-page/EditColor';

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
vi.mock('../../../../../src/apis/colorApi', () => ({
    getColorById: vi.fn(),
    updateColor: vi.fn(),
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

describe('EditColor', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all fields and buttons with loaded data', async () => {
        (colorApi.getColorById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'Red', code: '#ff0000' },
        });
        render(<EditColor />);
        expect(await screen.findByDisplayValue('Red')).toBeInTheDocument();
        const colorInputs = screen.getAllByDisplayValue('#ff0000');
        expect(colorInputs.length).toBeGreaterThan(1);
        expect(screen.getByText('editColor')).toBeInTheDocument();
        expect(screen.getByText('colorName')).toBeInTheDocument();
        expect(screen.getByText('colorCode')).toBeInTheDocument();
        expect(screen.getByText('preview')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('save')).toBeInTheDocument();
    });

    it('shows error toast if getColorById fails', async () => {
        (colorApi.getColorById as any).mockResolvedValueOnce({
            isSuccess: false,
            message: 'fail',
        });
        render(<EditColor />);
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', { autoClose: 1000 });
        });
    });

    it('shows error toast if required fields are empty and save is clicked', async () => {
        (colorApi.getColorById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: '', code: '' },
        });
        render(<EditColor />);
        await screen.findByDisplayValue('');
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('filledCondition', { autoClose: 1000 });
        });
    });

    it('calls updateColor and shows success toast on valid submit', async () => {
        (colorApi.getColorById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'Red', code: '#ff0000' },
        });
        (colorApi.updateColor as any).mockResolvedValueOnce({ isSuccess: true });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<EditColor />);
        expect(await screen.findByDisplayValue('Red')).toBeInTheDocument();
        // There are two inputs with value '#ff0000', get the text input (second one)
        const colorInputs = screen.getAllByDisplayValue('#ff0000');
        const textInput = colorInputs.find(
            (input) => input.getAttribute('type') === 'text'
        ) as HTMLInputElement;
        fireEvent.change(screen.getByDisplayValue('Red'), { target: { value: 'Blue' } });
        fireEvent.change(textInput, { target: { value: '#0000ff' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(colorApi.updateColor).toHaveBeenCalledWith('123', {
                name: 'Blue',
                code: '#0000ff',
            });
            expect(toast.success).toHaveBeenCalledWith('updatedColor', { autoClose: 1000 });
            expect(navigate).toHaveBeenCalledWith('/colors');
        });
    });

    it('shows error toast if updateColor fails', async () => {
        (colorApi.getColorById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'Red', code: '#ff0000' },
        });
        (colorApi.updateColor as any).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(<EditColor />);
        expect(await screen.findByDisplayValue('Red')).toBeInTheDocument();
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', { autoClose: 1000 });
        });
    });

    it('navigates to /colors when cancel is clicked', async () => {
        (colorApi.getColorById as any).mockResolvedValueOnce({
            isSuccess: true,
            data: { name: 'Red', code: '#ff0000' },
        });
        const navigate = vi.fn();
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);
        render(<EditColor />);
        expect(await screen.findByDisplayValue('Red')).toBeInTheDocument();
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith('/colors');
    });
});