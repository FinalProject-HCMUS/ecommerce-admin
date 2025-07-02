import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../../../src/components/common/Pagination';
import React from 'react';
import { vi } from 'vitest';
// Mock translation
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('Pagination', () => {
    it('renders current and total pages', () => {
        render(<Pagination currentPage={2} totalPages={5} onPageChange={() => { }} />);
        // Use flexible matcher for the label, or check for the numbers and "of"
        expect(screen.getByText((content) =>
            content.includes('showingPage')
        )).toBeInTheDocument();
        expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    });

    it('disables previous button on first page', () => {
        render(<Pagination currentPage={1} totalPages={5} onPageChange={() => { }} />);
        const prevButton = screen.getAllByRole('button')[0];
        expect(prevButton).toBeDisabled();
    });

    it('disables next button on last page', () => {
        render(<Pagination currentPage={5} totalPages={5} onPageChange={() => { }} />);
        const buttons = screen.getAllByRole('button');
        const nextButton = buttons[buttons.length - 1];
        expect(nextButton).toBeDisabled();
    });

    it('calls onPageChange with correct page when page button is clicked', () => {
        const onPageChange = vi.fn();
        render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
        fireEvent.click(screen.getByText('3'));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with previous page when previous button is clicked', () => {
        const onPageChange = vi.fn();
        render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
        const prevButton = screen.getAllByRole('button')[0];
        fireEvent.click(prevButton);
        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange with next page when next button is clicked', () => {
        const onPageChange = vi.fn();
        render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
        const buttons = screen.getAllByRole('button');
        const nextButton = buttons[buttons.length - 1];
        fireEvent.click(nextButton);
        expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('renders ellipsis when there are many pages', () => {
        render(<Pagination currentPage={6} totalPages={10} onPageChange={() => { }} />);
        expect(screen.getAllByText('...').length).toBeGreaterThan(0);
    });
});