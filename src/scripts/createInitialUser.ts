import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const createInitialUser = async () => {
  try {
    const userRef = await addDoc(collection(db, 'users'), {
      identifiant: 'admin',  // Identifiant de connexion
      password: 'admin123',  // À changer après la première connexion !
      nom: 'Administrateur',
      role: 'Administrateur',
      pole: 'Administration',
      statut: 'actif',
      derniereConnexion: null,
      dateCreation: serverTimestamp()
    });

    console.log('Utilisateur initial créé avec ID:', userRef.id);
    return userRef.id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur initial:', error);
    throw error;
  }
}; 