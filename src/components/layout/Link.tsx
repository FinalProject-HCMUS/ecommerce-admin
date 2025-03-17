import React from 'react';

interface LinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({ href, icon, children }) => {
  return (
    <a
      href={href}
      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
    >
      {icon}
      <span>{children}</span>
    </a>
  );
};