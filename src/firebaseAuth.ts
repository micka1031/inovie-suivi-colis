import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInAnonymously,
  updateProfile
} from 'firebase/auth';
import { app } from './firebaseConfig';
import { User } from './types';
import { getDocument, updateDocument, addDocument, queryCollection } from './firebaseUtils';

// Initialiser l'authentification Firebase
export const auth = getAuth(app);

// Fonction de connexion avec identifiant
export const loginWithId = async (identifiant: string, password: string): Promise<User> => {
  try {
    // Rechercher l'utilisateur dans Firestore par son identifiant
    const users = await queryCollection<User>({
      collection: 'users',
      where: [['identifiant', '==', identifiant]]
    });

    if (users.length === 0) {
      throw new Error('Identifiant non trouvé');
    }

    const userData = users[0];

    // Vérifier le mot de passe (à adapter selon votre logique de sécurité)
    if (userData.password !== password) {
      throw new Error('Mot de passe incorrect');
    }

    // Connexion anonyme à Firebase (pour maintenir une session)
    await signInAnonymously(auth);
    
    // Mettre à jour le profil avec l'identifiant
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: identifiant
      });
    }

    // Mettre à jour la dernière connexion
    await updateDocument<User>('users', userData.id, {
      derniereConnexion: new Date()
    });

    return userData;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code) || error.message);
  }
};

// Fonction de connexion
export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Récupérer les données utilisateur supplémentaires depuis Firestore
    const userData = await getDocument<User>('users', firebaseUser.uid);
    
    if (!userData) {
      throw new Error("Utilisateur non trouvé dans la base de données");
    }

    // Mettre à jour la dernière connexion
    await updateDocument<User>('users', firebaseUser.uid, {
      derniereConnexion: new Date()
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
  identifiant: string,
  password: string,
  nom: string,
  pole: string,
  role: string = 'user'
): Promise<User> => {
  try {
    // Vérifier si l'identifiant existe déjà
    const existingUsers = await queryCollection<User>({
      collection: 'users',
      where: [['identifiant', '==', identifiant]]
    });

    if (existingUsers.length > 0) {
      throw new Error('Cet identifiant est déjà utilisé');
    }

    // Créer le document utilisateur dans Firestore
    const userData: Omit<User, 'id'> = {
      identifiant,
      password, // Note: Dans un environnement de production, le mot de passe devrait être hashé
      nom,
      role,
      pole,
      statut: 'actif',
      derniereConnexion: null
    };

    // Connexion anonyme pour avoir un UID
    const { user: firebaseUser } = await signInAnonymously(auth);

    // Ajouter le document avec l'UID comme ID
    const newUser: User = {
      id: firebaseUser.uid,
      ...userData
    };

    await updateDocument('users', firebaseUser.uid, newUser);

    return newUser;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code) || error.message);
  }
};

// Fonction pour créer un utilisateur administrateur
export const createAdminUser = async (
  email: string,
  password: string,
  nom: string,
  pole: string
): Promise<User> => {
  try {
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Créer le document utilisateur dans Firestore
    const userData: Omit<User, 'id'> = {
      nom: nom,
      email: email,
      role: 'admin',
      pole: pole,
      statut: 'actif',
      derniereConnexion: null
    };

    // Ajouter le document avec l'UID comme ID
    await addDocument<User>('users', {
      ...userData,
      id: firebaseUser.uid
    });

    return {
      id: firebaseUser.uid,
      ...userData
    };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Mettre à jour les messages d'erreur
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return 'Identifiant ou mot de passe incorrect';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé';
    case 'auth/operation-not-allowed':
      return 'Opération non autorisée';
    default:
      return 'Une erreur est survenue lors de l\'authentification';
  }
}; 