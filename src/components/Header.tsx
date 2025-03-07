import React from 'react';
import { User } from '../types';
import { InovieLogo } from '../assets/inovie-logo';
import './Header.css';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, toggleSidebar }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="logo-container">
          <img src={InovieLogo} alt="Inovie Logo" className="header-logo" />
          <h1 className="header-title">SUIVI DE COLIS</h1>
        </div>
      </div>
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user?.nom || 'Utilisateur'}</span>
          <span className="user-role">{user?.role || 'Invité'}</span>
        </div>
        <button className="logout-button" onClick={onLogout}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

export default Header;