import React from 'react';
import { getAllowedNavItems } from './navItems';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
  const { user } = useAuth();

  if (!user) return null;

  const allowedNavItems = getAllowedNavItems(user.role);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center h-16 z-20">
      {allowedNavItems.map((item) => (
        <a
          key={item.id}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveView(item.id);
          }}
          className={`flex flex-col items-center justify-center w-full h-full text-xs transition-colors duration-200 transform ${
            activeView === item.id ? 'text-kia-primary' : 'text-gray-400 hover:text-kia-light'
          }`}
        >
          <div className="w-6 h-6 mb-1">{item.icon}</div>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default BottomNav;