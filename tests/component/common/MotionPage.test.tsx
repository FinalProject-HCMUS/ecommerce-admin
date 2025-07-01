import { render, screen } from '@testing-library/react';
import MotionPageWrapper from '../../../src/components/common/MotionPage';
import React from 'react';

describe('MotionPageWrapper', () => {
    it('renders children inside a motion.div', () => {
        render(
            <MotionPageWrapper>
                <div data-testid="child">Hello Motion</div>
            </MotionPageWrapper>
        );
        // Check that the child is rendered
        expect(screen.getByTestId('child')).toBeInTheDocument();
        // Check that the parent is a motion.div (has framer-motion data attribute)
        const motionDiv = screen.getByTestId('child').parentElement;
        expect(motionDiv?.tagName.toLowerCase()).toBe('div');
        // Optionally, check for framer-motion's data attributes
        expect(motionDiv).toHaveAttribute('style');
    });
});