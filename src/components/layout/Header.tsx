import LanguageToggle from '../common/LanguageToggle';
import React from 'react';

const Header = () => {
  const [lang, setLang] = React.useState<'en' | 'vi'>('en');
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between px-6 h-full">

        <LanguageToggle
          lang={lang}
          onToggle={() => setLang((prev) => (prev === 'en' ? 'vi' : 'en'))}
        />
        <div className="flex items-center space-x-4 mx-5">
          <div className="flex items-center space-x-2">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">hcdman</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;