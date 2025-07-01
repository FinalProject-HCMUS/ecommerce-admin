import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChangePassword from '../../../../src/components/page/about/edit-page/ChangePassword';
import React from 'react';
import { vi } from 'vitest';

// Mock hooks and modules
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
vi.mock('../../../../src/apis/userApi', () => ({
    changePassword: vi.fn(),
}));
vi.mock('../../../../src/context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 'user1' },
    }),
}));
vi.mock('react-toastify', () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

const { changePassword } = await import('../../../../src/apis/userApi');
const { toast } = await import('react-toastify');

// Helper to get input by label text (since label is not associated, use container/label traversal)
function getInputByLabel(labelText: string) {
    const label = screen.getByText(labelText);
    // The input is the next input element after the label
    const input = label.parentElement?.querySelector('input');
    if (!input) throw new Error(`Input for label "${labelText}" not found`);
    return input;
}

describe('ChangePassword', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all fields and buttons', () => {
        render(<ChangePassword />);
        expect(screen.getByText('editProfile')).toBeInTheDocument();
        expect(screen.getByText('changePassword')).toBeInTheDocument();
        expect(screen.getByText('oldPassword')).toBeInTheDocument();
        expect(screen.getByText('newPassword')).toBeInTheDocument();
        expect(screen.getByText('confirmPassword')).toBeInTheDocument();
        expect(screen.getByText('cancel')).toBeInTheDocument();
        expect(screen.getByText('save')).toBeInTheDocument();
    });

    it('shows password rules and alerts for invalid new password', () => {
        render(<ChangePassword />);
        fireEvent.change(getInputByLabel('newPassword'), { target: { value: 'short' } });
        expect(screen.getByText('alertEnterPassword')).toBeInTheDocument();
        expect(screen.getByText('minimumLength')).toBeInTheDocument();
    });

    it('shows alert if confirm password does not match', () => {
        render(<ChangePassword />);
        fireEvent.change(getInputByLabel('newPassword'), { target: { value: 'ValidPassword123!' } });
        fireEvent.change(getInputByLabel('confirmPassword'), { target: { value: 'Mismatch123!' } });
        expect(screen.getByText('alertMatch')).toBeInTheDocument();
    });

    it('calls toast error if new password is invalid on submit', async () => {
        render(<ChangePassword />);
        fireEvent.change(getInputByLabel('oldPassword'), { target: { value: 'oldpass' } });
        fireEvent.change(getInputByLabel('newPassword'), { target: { value: 'short' } });
        fireEvent.change(getInputByLabel('confirmPassword'), { target: { value: 'short' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it('calls changePassword and shows success on valid submit', async () => {
        (changePassword as any).mockResolvedValueOnce({ isSuccess: true });
        render(<ChangePassword />);
        fireEvent.change(getInputByLabel('oldPassword'), { target: { value: 'oldpass' } });
        fireEvent.change(getInputByLabel('newPassword'), { target: { value: 'ValidPassword123!' } });
        fireEvent.change(getInputByLabel('confirmPassword'), { target: { value: 'ValidPassword123!' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(changePassword).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalled();
        });
    });

    it('shows error toast if changePassword fails', async () => {
        (changePassword as any).mockResolvedValueOnce({ isSuccess: false, message: 'fail' });
        render(<ChangePassword />);
        fireEvent.change(getInputByLabel('oldPassword'), { target: { value: 'oldpass' } });
        fireEvent.change(getInputByLabel('newPassword'), { target: { value: 'ValidPassword123!' } });
        fireEvent.change(getInputByLabel('confirmPassword'), { target: { value: 'ValidPassword123!' } });
        fireEvent.click(screen.getByText('save'));
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('fail', expect.any(Object));
        });
    });

    it('toggles password visibility', () => {
        render(<ChangePassword />);
        const oldToggle = screen.getAllByRole('button')[0];
        fireEvent.click(oldToggle);
        // Optionally, add more assertions if your component changes input type or icon
    });

    it('calls navigate(-1) when cancel is clicked', async () => {
        const navigate = vi.fn();
        // Patch useNavigate for this test
        const routerDom = await import('react-router-dom');
        vi.spyOn(routerDom, 'useNavigate').mockReturnValue(navigate);

        render(<ChangePassword />);
        fireEvent.click(screen.getByText('cancel'));
        expect(navigate).toHaveBeenCalledWith(-1);
    });
});