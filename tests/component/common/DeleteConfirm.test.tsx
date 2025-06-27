import { render, screen, fireEvent } from '@testing-library/react';
import DeleteConfirmationModal from '../../../src/components/common/DeleteConfirm';
import React from 'react';
import { vi } from 'vitest';

// Mock MotionModalWrapper to just render children
vi.mock('../../../src/components/common/MotionModal', () => ({
    __esModule: true,
    default: (props: any) => <div data-testid="motion-modal">{props.children}</div>,
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('DeleteConfirmationModal', () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders nothing when closed', () => {
        render(
            <DeleteConfirmationModal
                isOpen={false}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                loading={false}
            />
        );
        expect(screen.queryByText('Delete Item')).not.toBeInTheDocument();
    });

    it('renders title and buttons when open', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                loading={false}
            />
        );
        expect(screen.getByText('Delete Item')).toBeInTheDocument();
        expect(screen.getByText('deleteConfirm')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('delete')).toBeInTheDocument();
    });

    it('calls onClose when close icon or cancel is clicked', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                loading={false}
            />
        );
        // Close icon (first button)
        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(onClose).toHaveBeenCalledTimes(1);

        // Cancel button (second button)
        fireEvent.click(screen.getByText('cancel'));
        expect(onClose).toHaveBeenCalledTimes(2);
    });

    it('calls onConfirm when delete is clicked', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                loading={false}
            />
        );
        fireEvent.click(screen.getByText('delete'));
        expect(onConfirm).toHaveBeenCalled();
    });

    it('disables delete button when loading', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={onClose}
                onConfirm={onConfirm}
                title="Delete Item"
                loading={true}
            />
        );
        expect(screen.getByText('delete')).toBeDisabled();
    });
});