import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { Link } from '../../../src/components/layout/Link';
import React from 'react';
describe('Link', () => {
    const mockIcon = <svg data-testid="mock-icon" />;
    const mockHref = 'https://example.com';
    const mockChildren = 'Test Link';

    it('renders correctly with all props', () => {
        render(
            <Link href={mockHref} icon={mockIcon}>
                {mockChildren}
            </Link>
        );

        expect(screen.getByRole('link')).toBeInTheDocument();
        expect(screen.getByText(mockChildren)).toBeInTheDocument();
        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('has correct href attribute', () => {
        render(
            <Link href={mockHref} icon={mockIcon}>
                {mockChildren}
            </Link>
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', mockHref);
    });

    it('renders icon correctly', () => {
        render(
            <Link href={mockHref} icon={mockIcon}>
                {mockChildren}
            </Link>
        );

        expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('renders children text correctly', () => {
        render(
            <Link href={mockHref} icon={mockIcon}>
                {mockChildren}
            </Link>
        );

        expect(screen.getByText(mockChildren)).toBeInTheDocument();
    });

    it('has correct CSS classes for styling', () => {
        render(
            <Link href={mockHref} icon={mockIcon}>
                {mockChildren}
            </Link>
        );

        const link = screen.getByRole('link');
        expect(link).toHaveClass(
            'flex',
            'items-center',
            'space-x-2',
            'px-4',
            'py-2',
            'text-gray-600',
            'hover:bg-blue-50',
            'hover:text-blue-600',
            'rounded-lg',
            'transition-colors'
        );
    });

    it('renders text inside a span element', () => {
        render(
            <Link href={mockHref} icon={mockIcon}>
                {mockChildren}
            </Link>
        );

        const span = screen.getByText(mockChildren);
        expect(span.tagName).toBe('SPAN');
    });

    it('works with different types of icons', () => {
        const differentIcon = <div data-testid="different-icon">Icon</div>;

        render(
            <Link href={mockHref} icon={differentIcon}>
                {mockChildren}
            </Link>
        );

        expect(screen.getByTestId('different-icon')).toBeInTheDocument();
    });

    it('works with complex children content', () => {
        const complexChildren = (
            <div>
                <span>Complex</span>
                <strong>Content</strong>
            </div>
        );

        render(
            <Link href={mockHref} icon={mockIcon}>
                {complexChildren}
            </Link>
        );

        expect(screen.getByText('Complex')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles empty href gracefully', () => {
        render(
            <Link href="" icon={mockIcon}>
                {mockChildren}
            </Link>
        );

        // Use querySelector to find the anchor tag directly since empty href may not have link role
        const link = document.querySelector('a');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '');
    });

    it('maintains accessibility for screen readers', () => {
        render(
            <Link href={mockHref} icon={mockIcon}>
                {mockChildren}
            </Link>
        );

        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveTextContent(mockChildren);
    });
});