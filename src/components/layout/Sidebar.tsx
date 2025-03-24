import { NavLink, useNavigate } from 'react-router-dom';
import { Package, List, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();


  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <NavLink to="/customers" className={({ isActive }) =>
          `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
          }`
        }
        >
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <Package size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`
          }
        >
          <List size={20} />
          <span>Categories</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => logout(navigate)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;