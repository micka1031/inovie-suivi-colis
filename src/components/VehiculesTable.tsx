import React, { useState } from 'react';
import { Vehicule } from '../types';
import './DataTable.css';

interface VehiculesTableProps {
  vehicules: Vehicule[];
}

const VehiculesTable: React.FC<VehiculesTableProps> = ({ vehicules }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [poleFilter, setPoleFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  
  // Filtrer les véhicules
  const filteredVehicules = vehicules.filter(vehicule => {
    const matchesSearch = vehicule.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPole = poleFilter ? vehicule.pole === poleFilter : true;
    const matchesService = serviceFilter ? vehicule.service === serviceFilter : true;
    
    return matchesSearch && matchesPole && matchesService;
  });
  
  // Obtenir les pôles et services uniques
  const poles = Array.from(new Set(vehicules.map(v => v.pole)));
  const services = Array.from(new Set(vehicules.map(v => v.service)));
  
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
        
        <div className="filter-group">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les services</option>
            {services.map(service => (
              <option key={service} value={service}>{service}</option>
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
              <th>Carburant</th>
              <th>Pôle</th>
              <th>Service</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicules.map(vehicule => (
              <tr key={vehicule.id}>
                <td>{vehicule.immatriculation}</td>
                <td>{vehicule.marque}</td>
                <td>{vehicule.modele}</td>
                <td>{vehicule.carburant}</td>
                <td>{vehicule.pole}</td>
                <td>{vehicule.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehiculesTable;