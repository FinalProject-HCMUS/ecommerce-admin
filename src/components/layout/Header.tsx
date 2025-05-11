import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LanguageToggle from '../common/LanguageToggle';
import React from 'react';

const Header = () => {
  const [lang, setLang] = React.useState<'en' | 'vi'>('en');
  const { user } = useAuth();
  const navigate = useNavigate();
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