import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export const resetAdmin = async () => {
  try {
    // Supprimer tous les utilisateurs existants avec l'identifiant 'admin'
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('identifiant', '==', 'admin'));
    const querySnapshot = await getDocs(q);
    
    // Supprimer les documents existants
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Créer un nouvel utilisateur admin
    const adminData = {
      identifiant: 'admin',
      password: 'admin123',
      nom: 'Administrateur',
      role: 'Administrateur',
      pole: 'Administration',
      statut: 'actif',
      dateCreation: new Date()
    };

    const newAdminRef = doc(collection(db, 'users'));
    await setDoc(newAdminRef, adminData);

    console.log('Utilisateur admin réinitialisé avec succès');
    console.log('Identifiant: admin');
    console.log('Mot de passe: admin123');

    return newAdminRef.id;
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de l\'admin:', error);
    throw error;
  }
}; 