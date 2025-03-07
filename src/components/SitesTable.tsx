import React, { useState } from 'react';
import { Site } from '../types';
import './DataTable.css';

interface SitesTableProps {
  sites: Site[];
}

const SitesTable: React.FC<SitesTableProps> = ({ sites }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [poleFilter, setPoleFilter] = useState('');
  
  // Filtrer les sites
  const filteredSites = sites.filter(site => {
    const matchesSearch = site.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         site.codeBarre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPole = poleFilter ? site.pole === poleFilter : true;
    
    return matchesSearch && matchesPole;
  });
  
  // Obtenir les pôles uniques
  const poles = Array.from(new Set(sites.map(s => s.pole)));
  
  return (
    <div className="data-table-container">
      <h1 className="page-title">Sites</h1>
      
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Rechercher par nom ou code barre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
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
              <th>Code Barre</th>
              <th>Pôle</th>
              <th>Ville</th>
              <th>Adresse</th>
              <th>Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {filteredSites.map(site => (
              <tr key={site.id}>
                <td>{site.nom}</td>
                <td>{site.codeBarre}</td>
                <td>{site.pole}</td>
                <td>{site.ville}</td>
                <td>{site.adresse}</td>
                <td>{site.tel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SitesTable;