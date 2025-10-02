import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-black shadow-md p-4 flex items-center justify-between z-10">
      <div className="w-40">
        <img src="https://serproauto.com.mx/wp-content/uploads/2025/03/SERPROAUTO.png" alt="SERPROAUTO Logo" className="h-10"/>
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-kia-light capitalize">{user.username}</p>
            <p className="text-xs text-kia-gray">{user.role}</p>
          </div>
          <button onClick={logout} title="Cerrar sesión" className="text-gray-400 hover:text-kia-primary transition-colors duration-200">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;