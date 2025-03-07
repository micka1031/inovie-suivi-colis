import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { InovieLogo } from '../assets/inovie-logo';

interface NavbarProps {
  user: {
    nom: string;
    role: string;
  };
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <header>
      <div className="header">
        <div className="logo-container">
          <img src={InovieLogo} alt="Inovie" className="logo" />
          <h1 className="app-title">SUIVI DE COLIS</h1>
        </div>
        <div className="user-info">
          <span>{user.nom}</span>
          <button className="reload-button" onClick={() => window.location.reload()}>
            <i className="fas fa-sync-alt"></i> Reload
          </button>
          <button className="logout-button" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        </div>
      </div>
      <div className="header-border"></div>
      <nav className="nav-menu">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive ? 'nav-item active' : 'nav-item'
          }
          end
        >
          Tableau de bord
        </NavLink>
        <NavLink 
          to="/passages" 
          className={({ isActive }) => 
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          Passages
        </NavLink>
        <NavLink 
          to="/sites" 
          className={({ isActive }) => 
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          Sites
        </NavLink>
        <NavLink 
          to="/tournees" 
          className={({ isActive }) => 
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          Tournées
        </NavLink>
        <NavLink 
          to="/vehicules" 
          className={({ isActive }) => 
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          Véhicules
        </NavLink>
        {user.role === 'Administrateur' && (
          <NavLink 
            to="/users" 
            className={({ isActive }) => 
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            Gestion des utilisateurs
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Navbar;