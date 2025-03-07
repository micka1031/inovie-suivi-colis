import React, { useState } from 'react';
import { Tournee } from '../types';
import './TourneesTable.css';

interface TourneesTableProps {
  tournees: Tournee[];
}

const TourneesTable: React.FC<TourneesTableProps> = ({ tournees }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTournees = tournees.filter(tournee => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (tournee.nom?.toLowerCase() || '').includes(searchLower) ||
      (tournee.description?.toLowerCase() || '').includes(searchLower) ||
      (tournee.vehicule?.toLowerCase() || '').includes(searchLower) ||
      (tournee.chauffeur?.toLowerCase() || '').includes(searchLower)
    );
  });

  return (
    <div className="tournees-table-container">
      <div className="table-header">
        <h2>Liste des Tournées</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher une tournée..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="tournees-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Véhicule</th>
            <th>Chauffeur</th>
            <th>Date de création</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {filteredTournees.map((tournee) => (
            <tr key={tournee.id}>
              <td>{tournee.nom || '-'}</td>
              <td>{tournee.description || '-'}</td>
              <td>{tournee.vehicule || '-'}</td>
              <td>{tournee.chauffeur || '-'}</td>
              <td>{tournee.dateCreation ? new Date(tournee.dateCreation.toDate()).toLocaleDateString() : '-'}</td>
              <td>
                <span className={`status-badge ${tournee.statut?.toLowerCase() || 'inconnu'}`}>
                  {tournee.statut || 'Inconnu'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TourneesTable;