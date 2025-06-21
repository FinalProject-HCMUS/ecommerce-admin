import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageToggle: React.FC<{ lang: string; onToggle?: () => void }> = ({ lang, onToggle }) => {
    const isEN = lang === 'en';

    return (
        <div
            className={`flex items-center bg-gray-100 rounded-full px-2 py-1 w-28 cursor-pointer border border-gray-200 ${isEN ? '' : 'flex-row-reverse'}`}
            onClick={onToggle}
            style={{ userSelect: 'none', transition: 'background 0.2s', overflow: 'hidden', position: 'relative' }}
        >
            <div className="relative w-8 h-8 mx-2 flex-shrink-0">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.img
                        key={lang}
                        src={isEN
                            ? 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
                            : 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'}
                        alt={isEN ? 'English' : 'Vietnamese'}
                        className="w-8 h-8 rounded-full object-cover absolute top-0 left-0"
                        initial={{ x: isEN ? -40 : 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: isEN ? 40 : -40, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30, duration: 0.25 }}
                    />
                </AnimatePresence>
            </div>
            <motion.span
                key={isEN ? 'EN' : 'VI'}
                initial={{ opacity: 0, y: isEN ? -10 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: isEN ? 10 : -10 }}
                transition={{ duration: 0.5 }}
                className="font-semibold text-gray-600 text-lg"
            >
                {isEN ? 'EN' : 'VI'}
            </motion.span>
        </div>
    );
};

export default LanguageToggle;