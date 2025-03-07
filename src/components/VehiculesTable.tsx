import React, { useState } from 'react';
import { Vehicule } from '../types';
import './DataTable.css';

interface VehiculesTableProps {
  vehicules: Vehicule[];
}

const VehiculesTable: React.FC<VehiculesTableProps> = ({ vehicules }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [marqueFilter, setMarqueFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState<'Disponible' | 'En service' | 'En maintenance' | ''>('');

  // Filtrer les véhicules
  const filteredVehicules = vehicules.filter(vehicule => {
    const matchesSearch = vehicule.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarque = marqueFilter ? vehicule.marque === marqueFilter : true;
    const matchesStatut = statutFilter ? vehicule.statut === statutFilter : true;
    
    return matchesSearch && matchesMarque && matchesStatut;
  });

  // Obtenir les marques uniques
  const marques = Array.from(new Set(vehicules.map(v => v.marque)));
  const statuts: Array<'Disponible' | 'En service' | 'En maintenance'> = ['Disponible', 'En service', 'En maintenance'];

  return (
    <div className="data-table-container">
      <h1 className="page-title">Véhicules</h1>
      
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Rechercher par immatriculation, marque ou modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={marqueFilter}
            onChange={(e) => setMarqueFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les marques</option>
            {marques.map(marque => (
              <option key={marque} value={marque}>{marque}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value as 'Disponible' | 'En service' | 'En maintenance' | '')}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            {statuts.map(statut => (
              <option key={statut} value={statut}>{statut}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Immatriculation</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Type</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicules.map(vehicule => (
              <tr key={vehicule.id}>
                <td>{vehicule.immatriculation}</td>
                <td>{vehicule.marque}</td>
                <td>{vehicule.modele}</td>
                <td>{vehicule.type}</td>
                <td>
                  <span className={`status-badge ${vehicule.statut.toLowerCase().replace(' ', '-')}`}>
                    {vehicule.statut}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiculesTable;