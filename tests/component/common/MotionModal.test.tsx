import { render, screen } from '@testing-library/react';
import MotionModalWrapper from '../../../src/components/common/MotionModal';
import React from 'react';

describe('MotionModalWrapper', () => {
    it('renders children inside a motion.div', () => {
        render(
            <MotionModalWrapper>
                <div data-testid="modal-child">Hello Modal</div>
            </MotionModalWrapper>
        );
        // Check that the child is rendered
        expect(screen.getByTestId('modal-child')).toBeInTheDocument();
        // Check that the parent is a div (motion.div renders as div)
        const parent = screen.getByTestId('modal-child').parentElement;
        expect(parent?.tagName.toLowerCase()).toBe('div');
        // Optionally, check for framer-motion style attribute
        expect(parent).toHaveAttribute('style');
    });
});