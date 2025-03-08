import React from 'react';
import { Link } from 'react-router-dom';
import { InovieLogo } from '../assets/inovie-logo';
import './Navbar.css';

interface NavbarProps {
  user: {
    nom?: string;
    role?: string;
  };
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={InovieLogo} alt="Inovie" className="logo" />
      </div>
      <div className="nav-links">
        <Link to="/">Tableau de bord</Link>
        <Link to="/passages">Passages</Link>
        <Link to="/sites">Sites</Link>
        <Link to="/tournees">Tournées</Link>
        <Link to="/vehicules">Véhicules</Link>
        {user?.role === 'Administrateur' && (
          <Link to="/admin/users">Gestion des utilisateurs</Link>
        )}
      </div>
      <div className="user-info">
        <span>{user?.nom}</span>
        <button onClick={onLogout}>Déconnexion</button>
      </div>
    </nav>
  );
};

export default Navbar;