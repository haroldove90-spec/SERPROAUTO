import React from 'react';
import { navItems, getAllowedNavItems } from './navItems';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const allowedNavItems = getAllowedNavItems(user.role);

  return (
    <aside className="hidden md:flex flex-col w-64 bg-black text-kia-light">
      <div className="flex items-center justify-center h-20 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wider">Dashboard</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {allowedNavItems.map((item) => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView(item.id);
            }}
            className={`flex items-center px-4 py-3 text-lg transition-colors duration-200 transform rounded-md ${
              activeView === item.id
                ? 'bg-kia-primary text-black font-bold'
                : 'text-gray-400 hover:bg-kia-dark-2 hover:text-kia-light'
            }`}
          >
            {item.icon}
            <span className="mx-4">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;