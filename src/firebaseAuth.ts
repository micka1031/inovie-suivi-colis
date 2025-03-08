import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { db, auth } from './firebaseConfig';
import { User } from './types';
import { getDocument, updateDocument, addDocument, queryCollection, doc, deleteDoc } from './firebaseUtils';

// Fonction de connexion
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Récupérer les données utilisateur depuis Firestore
    const userData = await getDocument<User>('users', firebaseUser.uid);
    
    if (!userData) {
      throw new Error("Utilisateur non trouvé dans la base de données");
    }

    // Mettre à jour le dernier accès
    await updateDocument<Partial<User>>('users', firebaseUser.uid, {
      dernierAcces: new Date().toISOString()
    });

    return userData;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Fonction de déconnexion
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Observer les changements d'état de l'authentification
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userData = await getDocument<User>('users', firebaseUser.uid);
      callback(userData);
    } else {
      callback(null);
    }
  });
};

// Fonction pour créer un nouvel utilisateur
export const createUser = async (
  email: string,
  password: string,
  nom: string,
  prenom: string,
  role: 'Utilisateur' | 'Administrateur',
  pole?: string
): Promise<User> => {
  try {
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Mettre à jour le profil Firebase
    await updateProfile(firebaseUser, {
      displayName: `${prenom} ${nom}`
    });

    // Créer le document utilisateur dans Firestore
    const newUser: Omit<User, "id"> = {
      email,
      nom,
      prenom,
      role,
      pole,
      dateCreation: new Date().toISOString(),
      dernierAcces: new Date().toISOString()
    };

    await updateDocument('users', firebaseUser.uid, newUser);

    return {
      id: firebaseUser.uid,
      ...newUser
    };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Fonction pour supprimer un utilisateur
export const deleteUserAccount = async (userId: string, userAuth: FirebaseUser | null) => {
  try {
    // Supprimer de Firestore
    await deleteDoc(doc(db, 'users', userId));

    // Si l'utilisateur actuellement connecté est celui qu'on veut supprimer
    if (userAuth && userAuth.email) {
      // Supprimer de Firebase Auth
      await deleteUser(userAuth);
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};

// Mettre à jour les messages d'erreur
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'Email ou mot de passe incorrect';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé';
    case 'auth/operation-not-allowed':
      return 'Opération non autorisée';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible';
    case 'auth/invalid-email':
      return 'Email invalide';
    default:
      return 'Une erreur est survenue lors de l\'authentification';
  }
};