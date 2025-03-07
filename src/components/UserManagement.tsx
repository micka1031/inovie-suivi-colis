import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface User {
  id: string;
  identifiant: string;
  nom: string;
  role: string;
  pole: string;
  statut: string;
  email?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({
    identifiant: '',
    nom: '',
    role: 'Utilisateur',
    pole: '',
    statut: 'actif',
    email: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Simuler des données utilisateurs pour la démonstration
      const mockUsers = [
        {
          id: '1',
          identifiant: 'admin',
          nom: 'Administrateur',
          role: 'Administrateur',
          pole: 'Administration',
          statut: 'actif',
          email: 'admin@inovie.fr'
        },
        {
          id: '2',
          identifiant: 'slherlier',
          nom: 'Sébastien Lherlier',
          role: 'Coursier',
          pole: 'Logistique',
          statut: 'actif',
          email: 'sebastien.lherlier@novus.fr'
        },
        {
          id: '3',
          identifiant: 'gsage',
          nom: 'Guillaume Sage',
          role: 'Coursier',
          pole: 'Logistique',
          statut: 'actif',
          email: 'guillaume.sage@novus.fr'
        },
        {
          id: '4',
          identifiant: 'jdupont',
          nom: 'Jean Dupont',
          role: 'Coursier',
          pole: 'Logistique',
          statut: 'actif',
          email: 'jean.dupont@novus.fr'
        },
        {
          id: '5',
          identifiant: 'mroude',
          nom: 'Michel Roude',
          role: 'Coursier',
          pole: 'Logistique',
          statut: 'actif',
          email: 'michel.roude@novus.fr'
        }
      ];
      
      setUsers(mockUsers);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      setError('Erreur lors de la récupération des données utilisateurs');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && currentUser.id) {
        // Mettre à jour un utilisateur existant
        console.log('Mise à jour de l\'utilisateur:', currentUser);
        
        // Dans une vraie application, vous utiliseriez updateDoc pour mettre à jour Firestore
        // Simulation pour la démonstration
        setUsers(users.map(user => 
          user.id === currentUser.id ? { ...user, ...currentUser as User } : user
        ));
      } else {
        // Ajouter un nouvel utilisateur
        console.log('Ajout d\'un nouvel utilisateur:', currentUser);
        
        // Simuler l'ajout avec un nouvel ID
        const newUser = {
          ...currentUser as User,
          id: Date.now().toString()
        };
        
        setUsers([...users, newUser]);
      }
      
      // Fermer le modal et réinitialiser le formulaire
      closeModal();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        // Dans une vraie application, vous utiliseriez deleteDoc pour supprimer de Firestore
        // Simulation pour la démonstration
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression');
      }
    }
  };

  const openAddModal = () => {
    setCurrentUser({
      identifiant: '',
      nom: '',
      role: 'Utilisateur',
      pole: '',
      statut: 'actif',
      email: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser({
      identifiant: '',
      nom: '',
      role: 'Utilisateur',
      pole: '',
      statut: 'actif',
      email: ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Gestion des utilisateurs</h2>
        <button className="add-button" onClick={openAddModal}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      <div className="user-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Identifiant</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Pôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.identifiant}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.pole}</td>
                <td>
                  <span className={user.statut === 'actif' ? 'livré' : 'en-cours'}>
                    {user.statut}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button 
                      onClick={() => handleEdit(user)} 
                      className="button button-secondary edit-button"
                    >
                      <i className="fas fa-edit"></i> Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)} 
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
      
      {/* Modal pour ajouter/modifier un utilisateur */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{isEditing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="identifiant" className="form-label">Identifiant</label>
                <input
                  type="text"
                  id="identifiant"
                  name="identifiant"
                  className="form-input"
                  value={currentUser.identifiant}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nom" className="form-label">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  className="form-input"
                  value={currentUser.nom}
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
                  value={currentUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role" className="form-label">Rôle</label>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={currentUser.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Utilisateur">Utilisateur</option>
                  <option value="Coursier">Coursier</option>
                  <option value="Administrateur">Administrateur</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="pole" className="form-label">Pôle</label>
                <input
                  type="text"
                  id="pole"
                  name="pole"
                  className="form-input"
                  value={currentUser.pole}
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
                  value={currentUser.statut}
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

export default UserManagement;