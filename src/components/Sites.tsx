import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface Site {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  type: string;
  statut: 'actif' | 'inactif';
}

const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSite, setCurrentSite] = useState<Partial<Site>>({
    nom: '',
    adresse: '',
    ville: '',
    codePostal: '',
    telephone: '',
    email: '',
    type: 'Laboratoire',
    statut: 'actif'
  });

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      
      // Simuler des données pour la démonstration
      const mockSites = [
        {
          id: '1',
          nom: 'Laboratoire Central',
          adresse: '15 rue des Sciences',
          ville: 'Toulouse',
          codePostal: '31000',
          telephone: '05.61.22.33.44',
          email: 'labo.central@inovie.fr',
          type: 'Laboratoire',
          statut: 'actif' as const
        },
        {
          id: '2',
          nom: 'Clinique SUB',
          adresse: '25 avenue de la Santé',
          ville: 'Toulouse',
          codePostal: '31400',
          telephone: '05.61.33.44.55',
          email: 'clinique.sub@inovie.fr',
          type: 'Clinique',
          statut: 'actif' as const
        },
        {
          id: '3',
          nom: 'Clinique Saint-Jean',
          adresse: '10 rue Saint-Jean',
          ville: 'Toulouse',
          codePostal: '31000',
          telephone: '05.61.44.55.66',
          email: 'saint.jean@inovie.fr',
          type: 'Clinique',
          statut: 'actif' as const
        },
        {
          id: '4',
          nom: 'Centre Médical Rangueil',
          adresse: '5 rue de Rangueil',
          ville: 'Toulouse',
          codePostal: '31400',
          telephone: '05.61.55.66.77',
          email: 'rangueil@inovie.fr',
          type: 'Centre Médical',
          statut: 'actif' as const
        },
        {
          id: '5',
          nom: 'Laboratoire Purpan',
          adresse: '2 avenue de Purpan',
          ville: 'Toulouse',
          codePostal: '31300',
          telephone: '05.61.66.77.88',
          email: 'labo.purpan@inovie.fr',
          type: 'Laboratoire',
          statut: 'actif' as const
        }
      ];
      
      setSites(mockSites);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des sites:', error);
      setError('Erreur lors de la récupération des données');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentSite(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentSite.id) {
        // Mettre à jour un site existant
        console.log('Mise à jour du site:', currentSite);
        
        // Dans une vraie application, vous utiliseriez updateDoc pour mettre à jour Firestore
        // Simulation pour la démonstration
        setSites(sites.map(site => 
          site.id === currentSite.id ? { ...site, ...currentSite as Site } : site
        ));
      } else {
        // Ajouter un nouveau site
        console.log('Ajout d\'un nouveau site:', currentSite);
        
        // Simuler l'ajout avec un nouvel ID
        const newSite = {
          ...currentSite as Site,
          id: Date.now().toString()
        };
        
        setSites([...sites, newSite]);
      }
      
      // Fermer le modal et réinitialiser le formulaire
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (site: Site) => {
    setCurrentSite(site);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce site ?')) {
      try {
        // Dans une vraie application, vous utiliseriez deleteDoc pour supprimer de Firestore
        // Simulation pour la démonstration
        setSites(sites.filter(site => site.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const openAddModal = () => {
    setCurrentSite({
      nom: '',
      adresse: '',
      ville: '',
      codePostal: '',
      telephone: '',
      email: '',
      type: 'Laboratoire',
      statut: 'actif'
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSite({
      nom: '',
      adresse: '',
      ville: '',
      codePostal: '',
      telephone: '',
      email: '',
      type: 'Laboratoire',
      statut: 'actif'
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des sites...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Sites</h2>
        <button className="add-button" onClick={openAddModal}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <div className="sites-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Adresse</th>
              <th>Ville</th>
              <th>Code Postal</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id}>
                <td>{site.nom}</td>
                <td>{site.type}</td>
                <td>{site.adresse}</td>
                <td>{site.ville}</td>
                <td>{site.codePostal}</td>
                <td>{site.telephone}</td>
                <td>{site.email}</td>
                <td>
                  <span className={site.statut === 'actif' ? 'livré' : 'en-cours'}>
                    {site.statut}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      onClick={() => handleEdit(site)} 
                      className="button button-secondary edit-button"
                    >
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(site.id)} 
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
      
      {/* Modal pour ajouter/modifier un site */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? 'Modifier le site' : 'Ajouter un site'}</h3>
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
                  value={currentSite.nom}
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
                  value={currentSite.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Laboratoire">Laboratoire</option>
                  <option value="Clinique">Clinique</option>
                  <option value="Centre Médical">Centre Médical</option>
                  <option value="Hôpital">Hôpital</option>
                  <option value="Cabinet">Cabinet</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="adresse" className="form-label">Adresse</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  className="form-input"
                  value={currentSite.adresse}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ville" className="form-label">Ville</label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  className="form-input"
                  value={currentSite.ville}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="codePostal" className="form-label">Code Postal</label>
                <input
                  type="text"
                  id="codePostal"
                  name="codePostal"
                  className="form-input"
                  value={currentSite.codePostal}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telephone" className="form-label">Téléphone</label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  className="form-input"
                  value={currentSite.telephone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={currentSite.email}
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
                  value={currentSite.statut}
                  onChange={handleInputChange}
                  required
                >
                  <option value="actif">Actif</option>
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

export default Sites;