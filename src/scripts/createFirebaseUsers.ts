import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { db, auth } from '../firebase';

export async function createFirebaseUsers() {
  try {
    // Authentification anonyme
    await signInAnonymously(auth);
    console.log('Authentification anonyme réussie');

    // Créer l'utilisateur admin dans Firebase Auth
    const adminEmail = 'admin@inovie.com';
    const adminPassword = 'admin123';

    try {
      console.log('Création de l\'utilisateur admin...');
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Utilisateur admin créé avec succès dans Firebase Auth');

      // Créer l'utilisateur admin dans Firestore
      const adminData = {
        identifier: 'admin',
        name: 'Administrateur',
        role: 'admin',
        department: 'Administration',
        status: 'actif',
        dateCreation: new Date(),
        dateModification: new Date()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), adminData);
      console.log('Données admin créées avec succès dans Firestore');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('L\'utilisateur admin existe déjà dans Firebase Auth');
        
        // Vérifier si l'utilisateur existe dans Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('identifier', '==', 'admin'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Si l'utilisateur n'existe pas dans Firestore, le créer
          const userDoc = doc(db, 'users');
          const adminData = {
            identifier: 'admin',
            name: 'Administrateur',
            role: 'admin',
            department: 'Administration',
            status: 'actif',
            dateCreation: new Date(),
            dateModification: new Date()
          };
          await setDoc(userDoc, adminData);
          console.log('Données admin créées avec succès dans Firestore');
        } else {
          console.log('L\'utilisateur admin existe déjà dans Firestore');
        }
      } else {
        throw error;
      }
    }

    console.log('Processus terminé');
  } catch (error) {
    console.error('Erreur lors de la création des utilisateurs:', error);
    throw error;
  }
} 