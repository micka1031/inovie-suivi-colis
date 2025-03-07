import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { createInitialUser } from './scripts/createInitialUser';

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBWDncE18JG9yjPX4kxTbSB9wLPi2qcAOw",
  authDomain: "application-inovie-scan.firebaseapp.com",
  projectId: "application-inovie-scan",
  storageBucket: "application-inovie-scan.firebasestorage.app",
  messagingSenderId: "703727839643",
  appId: "1:703727839643:web:f58c9241fb0d05a813593e",
  measurementId: "G-ZQF14KV51G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Fonction pour initialiser l'utilisateur admin
export const initializeAdmin = async () => {
  try {
    const userId = await createInitialUser();
    console.log('Utilisateur admin initialisé avec succès');
    return userId;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'admin:', error);
    throw error;
  }
};

export default app; 