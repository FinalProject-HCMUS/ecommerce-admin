import React from 'react';

const LanguageToggle: React.FC<{ lang: string; onToggle?: () => void }> = ({ lang, onToggle }) => {
    return (
        <div
            className="flex items-center bg-gray-100 rounded-full px-2 py-1 w-28 cursor-pointer border border-gray-200"
            onClick={onToggle}
            style={{ userSelect: 'none', transition: 'background 0.2s' }}
        >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow mr-2">
                <img
                    src={lang === 'vi'
                        ? 'https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg'
                        : 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'}
                    alt={lang === 'vi' ? 'Vietnamese' : 'English'}
                    className="w-6 h-6 rounded-full object-cover"
                />
            </div>
            <span className="font-semibold text-gray-600 text-lg">
                {lang === 'vi' ? 'VI' : 'EN'}
            </span>
        </div>
    );
};

export default LanguageToggle;