import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Vehicule {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  type: string;
  annee: number;
  statut: 'actif' | 'maintenance' | 'inactif';
  dernierEntretien?: string;
  coursierAssigne?: string;
  kilometrage: number;
}

const Vehicules: React.FC = () => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVehicule, setCurrentVehicule] = useState<Partial<Vehicule>>({
    immatriculation: '',
    marque: '',
    modele: '',
    type: 'Voiture',
    annee: new Date().getFullYear(),
    statut: 'actif',
    coursierAssigne: '',
    kilometrage: 0
  });

  useEffect(() => {
    fetchVehicules();
  }, []);

  const fetchVehicules = async () => {
    try {
      setLoading(true);
      
      // Simuler des données pour la démonstration
      const mockVehicules = [
        {
          id: '1',
          immatriculation: 'GE-695-RT',
          marque: 'Renault',
          modele: 'Kangoo',
          type: 'Utilitaire',
          annee: 2020,
          statut: 'actif' as const,
          dernierEntretien: '2023-01-15',
          coursierAssigne: 'Sébastien Lherlier',
          kilometrage: 45000
        },
        {
          id: '2',
          immatriculation: 'GI-456-AD',
          marque: 'Citroën',
          modele: 'Berlingo',
          type: 'Utilitaire',
          annee: 2021,
          statut: 'actif' as const,
          dernierEntretien: '2023-02-10',
          coursierAssigne: 'Guillaume Sage',
          kilometrage: 32500
        },
        {
          id: '3',
          immatriculation: 'GB-123-AZ',
          marque: 'Peugeot',
          modele: 'Partner',
          type: 'Utilitaire',
          annee: 2019,
          statut: 'actif' as const,
          dernierEntretien: '2023-01-05',
          coursierAssigne: 'Jean Dupont',
          kilometrage: 58200
        },
        {
          id: '4',
          immatriculation: 'GL-789-BA',
          marque: 'Renault',
          modele: 'Clio',
          type: 'Voiture',
          annee: 2022,
          statut: 'actif' as const,
          dernierEntretien: '2023-02-20',
          coursierAssigne: 'Michel Roude',
          kilometrage: 15800
        },
        {
          id: '5',
          immatriculation: 'GE-123-CD',
          marque: 'Volkswagen',
          modele: 'Caddy',
          type: 'Utilitaire',
          annee: 2020,
          statut: 'maintenance' as const,
          dernierEntretien: '2023-02-25',
          kilometrage: 42300
        }
      ];
      
      setVehicules(mockVehicules);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des véhicules:', error);
      setError('Erreur lors de la récupération des données');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = name === 'annee' || name === 'kilometrage' ? parseInt(value) : value;
    setCurrentVehicule(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentVehicule.id) {
        // Mettre à jour un véhicule existant
        console.log('Mise à jour du véhicule:', currentVehicule);
        
        // Dans une vraie application, vous utiliseriez updateDoc pour mettre à jour Firestore
        // Simulation pour la démonstration
        setVehicules(vehicules.map(vehicule => 
          vehicule.id === currentVehicule.id ? { ...vehicule, ...currentVehicule as Vehicule } : vehicule
        ));
      } else {
        // Ajouter un nouveau véhicule
        console.log('Ajout d\'un nouveau véhicule:', currentVehicule);
        
        // Simuler l'ajout avec un nouvel ID
        const newVehicule = {
          ...currentVehicule as Vehicule,
          id: Date.now().toString()
        };
        
        setVehicules([...vehicules, newVehicule]);
      }
      
      // Fermer le modal et réinitialiser le formulaire
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (vehicule: Vehicule) => {
    setCurrentVehicule(vehicule);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        // Dans une vraie application, vous utiliseriez deleteDoc pour supprimer de Firestore
        // Simulation pour la démonstration
        setVehicules(vehicules.filter(vehicule => vehicule.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const openAddModal = () => {
    setCurrentVehicule({
      immatriculation: '',
      marque: '',
      modele: '',
      type: 'Voiture',
      annee: new Date().getFullYear(),
      statut: 'actif',
      coursierAssigne: '',
      kilometrage: 0
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentVehicule({
      immatriculation: '',
      marque: '',
      modele: '',
      type: 'Voiture',
      annee: new Date().getFullYear(),
      statut: 'actif',
      coursierAssigne: '',
      kilometrage: 0
    });
    setIsEditing(false);
  };

  const getStatusClass = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'livré';
      case 'maintenance':
        return 'en-cours';
      case 'inactif':
        return 'en-cours';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des véhicules...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Véhicules</h2>
        <button className="add-button" onClick={openAddModal}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <div className="vehicules-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Immatriculation</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Type</th>
              <th>Année</th>
              <th>Kilométrage</th>
              <th>Dernier Entretien</th>
              <th>Coursier Assigné</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicules.map((vehicule) => (
              <tr key={vehicule.id}>
                <td>{vehicule.immatriculation}</td>
                <td>{vehicule.marque}</td>
                <td>{vehicule.modele}</td>
                <td>{vehicule.type}</td>
                <td>{vehicule.annee}</td>
                <td>{vehicule.kilometrage.toLocaleString()} km</td>
                <td>{vehicule.dernierEntretien || '-'}</td>
                <td>{vehicule.coursierAssigne || '-'}</td>
                <td>
                  <span className={getStatusClass(vehicule.statut)}>
                    {vehicule.statut}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      onClick={() => handleEdit(vehicule)} 
                      className="button button-secondary edit-button"
                    >
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(vehicule.id)} 
                      className="button button-danger delete-button"
                    >
                      <i className="fas fa-trash-alt"></i> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal pour ajouter/modifier un véhicule */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? 'Modifier le véhicule' : 'Ajouter un véhicule'}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="immatriculation" className="form-label">Immatriculation</label>
                <input
                  type="text"
                  id="immatriculation"
                  name="immatriculation"
                  className="form-input"
                  value={currentVehicule.immatriculation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="marque" className="form-label">Marque</label>
                <input
                  type="text"
                  id="marque"
                  name="marque"
                  className="form-input"
                  value={currentVehicule.marque}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="modele" className="form-label">Modèle</label>
                <input
                  type="text"
                  id="modele"
                  name="modele"
                  className="form-input"
                  value={currentVehicule.modele}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type" className="form-label">Type</label>
                <select
                  id="type"
                  name="type"
                  className="form-select"
                  value={currentVehicule.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Voiture">Voiture</option>
                  <option value="Utilitaire">Utilitaire</option>
                  <option value="Moto">Moto</option>
                  <option value="Vélo">Vélo</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="annee" className="form-label">Année</label>
                <input
                  type="number"
                  id="annee"
                  name="annee"
                  className="form-input"
                  value={currentVehicule.annee}
                  onChange={handleInputChange}
                  min="2000"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="kilometrage" className="form-label">Kilométrage</label>
                <input
                  type="number"
                  id="kilometrage"
                  name="kilometrage"
                  className="form-input"
                  value={currentVehicule.kilometrage}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="dernierEntretien" className="form-label">Dernier Entretien</label>
                <input
                  type="date"
                  id="dernierEntretien"
                  name="dernierEntretien"
                  className="form-input"
                  value={currentVehicule.dernierEntretien || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="coursierAssigne" className="form-label">Coursier Assigné</label>
                <input
                  type="text"
                  id="coursierAssigne"
                  name="coursierAssigne"
                  className="form-input"
                  value={currentVehicule.coursierAssigne || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="statut" className="form-label">Statut</label>
                <select
                  id="statut"
                  name="statut"
                  className="form-select"
                  value={currentVehicule.statut}
                  onChange={handleInputChange}
                  required
                >
                  <option value="actif">Actif</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="button button-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="button">
                  {isEditing ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicules;