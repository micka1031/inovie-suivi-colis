import React, { useState } from 'react';
import { User } from '../types';
import { getCollection, updateDocument, deleteDocument } from '../firebaseUtils';
import './DataTable.css';

interface AdminUsersTableProps {
  users: User[];
  onUserUpdated: () => void;
}

const AdminUsersTable: React.FC<AdminUsersTableProps> = ({ users, onUserUpdated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [poleFilter, setPoleFilter] = useState('');

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesPole = poleFilter ? user.pole === poleFilter : true;
    
    return matchesSearch && matchesRole && matchesPole;
  });

  // Obtenir les rôles et pôles uniques
  const roles = Array.from(new Set(users.map(u => u.role)));
  const poles = Array.from(new Set(users.filter(u => u.pole).map(u => u.pole)));

  // Supprimer un utilisateur
  const handleDelete = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteDocument('users', userId);
        onUserUpdated();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <div className="data-table-container">
      <h1 className="page-title">Gestion des Utilisateurs</h1>
      
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les rôles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={poleFilter}
            onChange={(e) => setPoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les pôles</option>
            {poles.map(pole => (
              <option key={pole} value={pole}>{pole}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Pôle</th>
              <th>Date de création</th>
              <th>Dernier accès</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.pole || '-'}</td>
                <td>{user.dateCreation}</td>
                <td>{user.dernierAcces || 'Jamais'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="delete-button"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersTable;