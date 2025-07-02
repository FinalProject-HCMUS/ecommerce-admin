import { render, screen, fireEvent } from '@testing-library/react';
import LanguageToggle from '../../../src/components/common/LanguageToggle';
import React from 'react';
import { vi } from 'vitest';
describe('LanguageToggle', () => {
    it('renders EN flag and label when lang is "en"', () => {
        render(<LanguageToggle lang="en" />);
        expect(screen.getByAltText('English')).toBeInTheDocument();
        expect(screen.getByText('EN')).toBeInTheDocument();
        expect(screen.queryByAltText('Vietnamese')).not.toBeInTheDocument();
        expect(screen.queryByText('VI')).not.toBeInTheDocument();
    });

    it('renders VI flag and label when lang is "vi"', () => {
        render(<LanguageToggle lang="vi" />);
        expect(screen.getByAltText('Vietnamese')).toBeInTheDocument();
        expect(screen.getByText('VI')).toBeInTheDocument();
        expect(screen.queryByAltText('English')).not.toBeInTheDocument();
        expect(screen.queryByText('EN')).not.toBeInTheDocument();
    });

    it('calls onToggle when clicked', () => {
        const onToggle = vi.fn();
        render(<LanguageToggle lang="en" onToggle={onToggle} />);
        fireEvent.click(screen.getByRole('img', { name: 'English' }).closest('div')!);
        expect(onToggle).toHaveBeenCalled();
    });
});