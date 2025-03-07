import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      setUsers(usersData);
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
        const userRef = doc(db, 'users', currentUser.id);
        await updateDoc(userRef, currentUser);
        
        setUsers(users.map(user => 
          user.id === currentUser.id ? { ...user, ...currentUser as User } : user
        ));
      } else {
        // Créer le compte Firebase Auth
        const email = currentUser.email || `${currentUser.identifiant}@inovie.fr`;
        const defaultPassword = 'Inovie2024!'; // Mot de passe par défaut

        // Créer l'utilisateur dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, defaultPassword);
        
        // Ajouter l'utilisateur dans Firestore
        const newUserData = {
          ...currentUser,
          uid: userCredential.user.uid,
          email: email,
          createdAt: new Date().toISOString()
        };
        
        const docRef = await addDoc(collection(db, 'users'), newUserData);
        const newUser = {
          id: docRef.id,
          ...newUserData
        } as User;
        
        setUsers([...users, newUser]);
      }
      
      closeModal();
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement:', error);
      setError(error.message || 'Erreur lors de l\'enregistrement');
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
        // Supprimer l'utilisateur de Firestore
        await deleteDoc(doc(db, 'users', id));
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
              <th>Rôle</th>
              <th>Pôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.identifiant}</td>
                <td>{user.nom}</td>
                <td>{user.role}</td>
                <td>{user.pole}</td>
                <td>{user.statut}</td>
                <td>
                  <button className="edit-button" onClick={() => handleEdit(user)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(user.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{isEditing ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="identifiant">Identifiant</label>
                <input
                  type="text"
                  id="identifiant"
                  name="identifiant"
                  value={currentUser.identifiant}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={currentUser.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleInputChange}
                  placeholder="identifiant@inovie.fr"
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rôle</label>
                <select
                  id="role"
                  name="role"
                  value={currentUser.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Administrateur">Administrateur</option>
                  <option value="Utilisateur">Utilisateur</option>
                  <option value="Coursier">Coursier</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="pole">Pôle</label>
                <input
                  type="text"
                  id="pole"
                  name="pole"
                  value={currentUser.pole}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="statut">Statut</label>
                <select
                  id="statut"
                  name="statut"
                  value={currentUser.statut}
                  onChange={handleInputChange}
                  required
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="save-button">
                  {isEditing ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button type="button" className="cancel-button" onClick={closeModal}>
                  Annuler
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