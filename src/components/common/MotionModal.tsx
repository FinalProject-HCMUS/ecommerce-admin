import React from 'react';
import { motion } from 'framer-motion';

interface MotionWrapperProps {
    children: React.ReactNode;
}

const MotionModalWrapper: React.FC<MotionWrapperProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};

export default MotionModalWrapper;