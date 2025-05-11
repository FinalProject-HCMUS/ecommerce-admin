import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from '../common/LanguageToggle';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const [lang, setLang] = React.useState<'en' | 'vi'>('en');
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleLanguageChange = () => {
    const language = lang === 'en' ? 'vi' : 'en';
    setLang(language);
    i18n.changeLanguage(language);
  };
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between px-6 h-full">

        <LanguageToggle
          lang={lang}
          onToggle={handleLanguageChange}
        />
        <div className="flex items-center space-x-4 mx-5">
          <div className="flex items-center space-x-2">
            <img
              onClick={() => navigate('/about')}
              src={user?.photo || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
            />
            <span className="font-medium">{user?.firstName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;