import { NavLink, useNavigate } from 'react-router-dom';
import { Package, List, LogOut, Palette, RulerIcon, Info, Users, Boxes, MessageCircleMore, NotebookPen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('sidebar');
  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">{t('title')}</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <NavLink
          to="/customers"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <Users size={20} />
          <span>{t('customers')}</span>
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <Package size={20} />
          <span>{t('products')}</span>
        </NavLink>
        <NavLink
          to="/colors"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <Palette size={20} />
          <span>{t('colors')}</span>
        </NavLink>
        <NavLink
          to="/sizes"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <RulerIcon size={20} />
          <span>{t('sizes')}</span>
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <List size={20} />
          <span>{t('categories')}</span>
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <Boxes size={20} />
          <span>{t('orders')}</span>



        </NavLink>
        <NavLink
          to="/messages"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <MessageCircleMore size={20} />
          <span>Messages</span>
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <NotebookPen size={20} />
          <span>Blogs</span>
        </NavLink>
        {/* Dropdown Menu for Statistics */}
        <div>
          <button
            onClick={() => setIsStatisticsOpen(!isStatisticsOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <BarChart3Icon size={20} />
              <span>Statistics</span>
            </div>
            {isStatisticsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {isStatisticsOpen && (
            <div className="ml-6 space-y-1">
              <NavLink
                to="/statistics/revenue"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
              >
                Revenue Analysis
              </NavLink>
              <NavLink
                to="/statistics/categories"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
              >
                Product Categories
              </NavLink>
              <NavLink
                to="/statistics/orders"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
              >
                Order Statistics
              </NavLink>
              <NavLink
                to="/statistics/top-products"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`
                }
              >
                Top Products
              </NavLink>
            </div>
          )}
        </div>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <Info size={20} />
          <span>{t('about')}</span>
        </NavLink>

      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => logout(navigate)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-full"
        >
          <LogOut size={20} />
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;