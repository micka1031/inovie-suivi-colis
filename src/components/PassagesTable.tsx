import React, { useState } from 'react';
import { Passage, Site, Tournee, Vehicule } from '../types';
import './DataTable.css';

interface PassagesTableProps {
  passages: Passage[];
  sites: Site[];
  tournees: Tournee[];
  vehicules: Vehicule[];
}

const PassagesTable: React.FC<PassagesTableProps> = ({ passages, sites, tournees, vehicules }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [tourneeFilter, setTourneeFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

  // Filtrer les passages
  const filteredPassages = passages.filter(passage => {
    const matchesSearch = passage.idColis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = siteFilter ? passage.siteDepart === siteFilter || passage.siteFin === siteFilter : true;
    const matchesTournee = tourneeFilter ? passage.tournee === tourneeFilter : true;
    const matchesStatut = statutFilter ? passage.statut === statutFilter : true;

    return matchesSearch && matchesSite && matchesTournee && matchesStatut;
  });

  // Obtenir les statuts uniques
  const statuts = Array.from(new Set(passages.map(p => p.statut)));

  return (
    <div className="data-table-container">
      <h1 className="page-title">Passages de colis</h1>
      
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Rechercher par ID colis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tous les sites</option>
            {sites.map(site => (
              <option key={site.id} value={site.nom}>{site.nom}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={tourneeFilter}
            onChange={(e) => setTourneeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Toutes les tournées</option>
            {tournees.map(tournee => (
              <option key={tournee.id} value={tournee.nom}>{tournee.nom}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <select
            value={statutFilter}
            onChange={(e) => setStatutFilter(e.target.value)}
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
              <th>ID Colis</th>
              <th>Site Départ</th>
              <th>Date/Heure Départ</th>
              <th>Site Fin</th>
              <th>Date/Heure Livraison</th>
              <th>Statut</th>
              <th>Coursier Chargement</th>
              <th>Coursier Livraison</th>
              <th>Véhicule</th>
              <th>Tournée</th>
            </tr>
          </thead>
          <tbody>
            {filteredPassages.map(passage => (
              <tr key={passage.id}>
                <td>{passage.idColis}</td>
                <td>{passage.siteDepart}</td>
                <td>{passage.dateHeureDepart.toDate().toLocaleString()}</td>
                <td>{passage.siteFin}</td>
                <td>{passage.dateHeureLivraison ? passage.dateHeureLivraison.toDate().toLocaleString() : '-'}</td>
                <td>{passage.statut}</td>
                <td>{passage.coursierChargement}</td>
                <td>{passage.coursierLivraison || '-'}</td>
                <td>{passage.vehicule}</td>
                <td>{passage.tournee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PassagesTable; 