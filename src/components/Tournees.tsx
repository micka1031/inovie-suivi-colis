import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';

interface Tournee {
  id: string;
  nom: string;
  date: Timestamp;
  heureDepart: string;
  heureFinPrevue: string;
  heureFinReelle?: string;
  coursier: string;
  vehicule: string;
  nombreColis: number;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'annulee';
  siteDepart: string;
}

const Tournees: React.FC = () => {
  const [tournees, setTournees] = useState<Tournee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTournee, setCurrentTournee] = useState<Partial<Tournee>>({
    nom: '',
    date: Timestamp.fromDate(new Date()),
    heureDepart: '08:00',
    heureFinPrevue: '17:00',
    coursier: '',
    vehicule: '',
    nombreColis: 0,
    statut: 'en_attente',
    siteDepart: ''
  });

  useEffect(() => {
    fetchTournees();
  }, []);

  const fetchTournees = async () => {
    try {
      setLoading(true);
      
      // Simuler des données pour la démonstration
      const mockTournees = [
        {
          id: '1',
          nom: 'Tournée Matin Est',
          date: Timestamp.fromDate(new Date('2023-02-24')),
          heureDepart: '07:00',
          heureFinPrevue: '12:00',
          heureFinReelle: '11:45',
          coursier: 'Sébastien Lherlier',
          vehicule: 'GE-695-RT',
          nombreColis: 15,
          statut: 'terminee' as const,
          siteDepart: 'Laboratoire Central'
        },
        {
          id: '2',
          nom: 'Tournée Matin Ouest',
          date: Timestamp.fromDate(new Date('2023-02-24')),
          heureDepart: '07:30',
          heureFinPrevue: '12:30',
          heureFinReelle: '12:15',
          coursier: 'Guillaume Sage',
          vehicule: 'GI-456-AD',
          nombreColis: 12,
          statut: 'terminee' as const,
          siteDepart: 'Laboratoire Purpan'
        },
        {
          id: '3',
          nom: 'Tournée Après-midi Est',
          date: Timestamp.fromDate(new Date('2023-02-24')),
          heureDepart: '13:00',
          heureFinPrevue: '18:00',
          coursier: 'Sébastien Lherlier',
          vehicule: 'GE-695-RT',
          nombreColis: 10,
          statut: 'en_cours' as const,
          siteDepart: 'Laboratoire Central'
        },
        {
          id: '4',
          nom: 'Tournée Après-midi Ouest',
          date: Timestamp.fromDate(new Date('2023-02-24')),
          heureDepart: '13:30',
          heureFinPrevue: '18:30',
          coursier: 'Jean Dupont',
          vehicule: 'GB-123-AZ',
          nombreColis: 8,
          statut: 'en_cours' as const,
          siteDepart: 'Laboratoire Purpan'
        },
        {
          id: '5',
          nom: 'Tournée Urgence',
          date: Timestamp.fromDate(new Date('2023-02-24')),
          heureDepart: '14:00',
          heureFinPrevue: '16:00',
          coursier: 'Michel Roude',
          vehicule: 'GL-789-BA',
          nombreColis: 3,
          statut: 'en_attente' as const,
          siteDepart: 'Clinique SUB'
        }
      ];
      
      setTournees(mockTournees);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des tournées:', error);
      setError('Erreur lors de la récupération des données');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      // Convertir la date en Timestamp
      const dateObj = new Date(value);
      setCurrentTournee(prev => ({ ...prev, [name]: Timestamp.fromDate(dateObj) }));
    } else if (name === 'nombreColis') {
      // Convertir en nombre
      setCurrentTournee(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setCurrentTournee(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentTournee.id) {
        // Mettre à jour une tournée existante
        console.log('Mise à jour de la tournée:', currentTournee);
        
        // Dans une vraie application, vous utiliseriez updateDoc pour mettre à jour Firestore
        // Simulation pour la démonstration
        setTournees(tournees.map(tournee => 
          tournee.id === currentTournee.id ? { ...tournee, ...currentTournee as Tournee } : tournee
        ));
      } else {
        // Ajouter une nouvelle tournée
        console.log('Ajout d\'une nouvelle tournée:', currentTournee);
        
        // Simuler l'ajout avec un nouvel ID
        const newTournee = {
          ...currentTournee as Tournee,
          id: Date.now().toString()
        };
        
        setTournees([...tournees, newTournee]);
      }
      
      // Fermer le modal et réinitialiser le formulaire
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (tournee: Tournee) => {
    setCurrentTournee(tournee);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tournée ?')) {
      try {
        // Dans une vraie application, vous utiliseriez deleteDoc pour supprimer de Firestore
        // Simulation pour la démonstration
        setTournees(tournees.filter(tournee => tournee.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const openAddModal = () => {
    setCurrentTournee({
      nom: '',
      date: Timestamp.fromDate(new Date()),
      heureDepart: '08:00',
      heureFinPrevue: '17:00',
      coursier: '',
      vehicule: '',
      nombreColis: 0,
      statut: 'en_attente',
      siteDepart: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTournee({
      nom: '',
      date: Timestamp.fromDate(new Date()),
      heureDepart: '08:00',
      heureFinPrevue: '17:00',
      coursier: '',
      vehicule: '',
      nombreColis: 0,
      statut: 'en_attente',
      siteDepart: ''
    });
    setIsEditing(false);
  };

  const formatDate = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusClass = (statut: string) => {
    switch (statut) {
      case 'terminee':
        return 'livré';
      case 'en_cours':
        return 'en-cours';
      case 'en_attente':
        return 'en-cours';
      case 'annulee':
        return 'en-cours';
      default:
        return '';
    }
  };

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'terminee':
        return 'Terminée';
      case 'en_cours':
        return 'En cours';
      case 'en_attente':
        return 'En attente';
      case 'annulee':
        return 'Annulée';
      default:
        return statut;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des tournées...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Tournées</h2>
        <button className="add-button" onClick={openAddModal}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <div className="tournees-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Date</th>
              <th>Heure Départ</th>
              <th>Heure Fin Prévue</th>
              <th>Heure Fin Réelle</th>
              <th>Coursier</th>
              <th>Véhicule</th>
              <th>Nombre de Colis</th>
              <th>Site Départ</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournees.map((tournee) => (
              <tr key={tournee.id}>
                <td>{tournee.nom}</td>
                <td>{formatDate(tournee.date)}</td>
                <td>{tournee.heureDepart}</td>
                <td>{tournee.heureFinPrevue}</td>
                <td>{tournee.heureFinReelle || '-'}</td>
                <td>{tournee.coursier}</td>
                <td>{tournee.vehicule}</td>
                <td>{tournee.nombreColis}</td>
                <td>{tournee.siteDepart}</td>
                <td>
                  <span className={getStatusClass(tournee.statut)}>
                    {getStatusLabel(tournee.statut)}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      onClick={() => handleEdit(tournee)} 
                      className="button button-secondary edit-button"
                    >
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(tournee.id)} 
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
      
      {/* Modal pour ajouter/modifier une tournée */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? 'Modifier la tournée' : 'Ajouter une tournée'}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nom" className="form-label">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  className="form-input"
                  value={currentTournee.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={currentTournee.date ? currentTournee.date.toDate().toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="heureDepart" className="form-label">Heure de Départ</label>
                <input
                  type="time"
                  id="heureDepart"
                  name="heureDepart"
                  className="form-input"
                  value={currentTournee.heureDepart}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="heureFinPrevue" className="form-label">Heure de Fin Prévue</label>
                <input
                  type="time"
                  id="heureFinPrevue"
                  name="heureFinPrevue"
                  className="form-input"
                  value={currentTournee.heureFinPrevue}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="heureFinReelle" className="form-label">Heure de Fin Réelle</label>
                <input
                  type="time"
                  id="heureFinReelle"
                  name="heureFinReelle"
                  className="form-input"
                  value={currentTournee.heureFinReelle || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="coursier" className="form-label">Coursier</label>
                <input
                  type="text"
                  id="coursier"
                  name="coursier"
                  className="form-input"
                  value={currentTournee.coursier}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="vehicule" className="form-label">Véhicule</label>
                <input
                  type="text"
                  id="vehicule"
                  name="vehicule"
                  className="form-input"
                  value={currentTournee.vehicule}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nombreColis" className="form-label">Nombre de Colis</label>
                <input
                  type="number"
                  id="nombreColis"
                  name="nombreColis"
                  className="form-input"
                  value={currentTournee.nombreColis}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="siteDepart" className="form-label">Site de Départ</label>
                <input
                  type="text"
                  id="siteDepart"
                  name="siteDepart"
                  className="form-input"
                  value={currentTournee.siteDepart}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="statut" className="form-label">Statut</label>
                <select
                  id="statut"
                  name="statut"
                  className="form-select"
                  value={currentTournee.statut}
                  onChange={handleInputChange}
                  required
                >
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                  <option value="annulee">Annulée</option>
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

export default Tournees;