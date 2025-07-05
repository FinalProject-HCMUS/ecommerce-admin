import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from '../common/LanguageToggle';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';
const Header = () => {
  const [lang, setLang] = useState<string>();
  const { i18n } = useTranslation();
  const { t } = useTranslation('common');
  const { user } = useAuth();

  const navigate = useNavigate();
  const handleLanguageChange = () => {
    const language = lang === 'en' ? 'vi' : 'en';
    setLang(language);
    i18n.changeLanguage(language);
  };
  useEffect(() => {
    setLang(t("language"));
  }, []);
  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between px-6 h-full">

        {lang && <LanguageToggle
          lang={lang}
          onToggle={handleLanguageChange}
        />}
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