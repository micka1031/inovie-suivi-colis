import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app; 