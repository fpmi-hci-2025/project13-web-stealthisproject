import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary-900 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
              <span className="text-primary-900 font-bold text-xl">ЖД</span>
            </div>
            <span className="text-xl font-bold text-white">Вокзал Минск</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-primary-300 transition font-medium">
              Расписание
            </Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-white hover:text-primary-300 transition font-medium">
                Мои билеты
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-white text-sm hover:text-primary-300 transition cursor-pointer font-medium"
                >
                  {user?.firstName} {user?.lastName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-white text-primary-900 rounded-lg hover:bg-primary-50 transition font-semibold shadow-md"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-white text-primary-900 rounded-lg hover:bg-primary-50 transition font-semibold shadow-md"
              >
                Войти
              </button>
            )}
          </nav>

          <button className="md:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

