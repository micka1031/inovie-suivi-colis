import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './UserManagement.css';

interface User {
  id: string;
  identifiant: string;
  nom: string;
  role: string;
  pole: string;
  statut: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        setError('Erreur lors du chargement des utilisateurs');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de l\'utilisateur');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="user-management">
      <h2>Gestion des utilisateurs</h2>
      <table>
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
                <button 
                  onClick={() => handleDelete(user.id)}
                  disabled={user.role === 'Administrateur'}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;