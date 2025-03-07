import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import Passages from './components/Passages';
import Sites from './components/Sites';
import Tournees from './components/Tournees';
import Vehicules from './components/Vehicules';
import UserManagement from './components/UserManagement';
import Navbar from './components/Navbar';
import './App.css';

interface UserData {
  id: string;
  identifiant: string;
  nom: string;
  role: string;
  pole: string;
  statut: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeAdminUser = async (identifier: string) => {
    const usersRef = collection(db, 'users');
    const adminData = {
      identifiant: identifier,
      nom: 'Administrateur',
      role: 'Administrateur',
      pole: 'Administration',
      statut: 'actif',
      email: 'admin@inovie.fr',
      createdAt: new Date().toISOString()
    };

    try {
      // Vérifier si l'admin existe déjà
      const q = query(usersRef, where('identifiant', '==', identifier));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Créer l'admin s'il n'existe pas
        const docRef = await setDoc(doc(usersRef, 'admin'), adminData);
        console.log('Admin user created');
        return { id: 'admin', ...adminData };
      } else {
        // Mettre à jour le rôle si nécessaire
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        if (userData.role !== 'Administrateur') {
          await setDoc(doc(usersRef, userDoc.id), { ...userData, role: 'Administrateur' }, { merge: true });
          console.log('Admin role updated');
        }
        return { id: userDoc.id, ...userData };
      }
    } catch (error) {
      console.error('Error initializing admin:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const identifier = firebaseUser.email?.split('@')[0] || '';
          
          let userData: UserData | null = null;

          if (identifier === 'admin') {
            // S'assurer que l'utilisateur admin a les bons droits
            userData = await initializeAdminUser(identifier) as UserData;
          } else {
            // Rechercher l'utilisateur normal dans Firestore
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('identifiant', '==', identifier));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              userData = { ...userDoc.data(), id: userDoc.id } as UserData;
            }
          }

          if (userData) {
            setUser(userData);
          } else {
            console.error('Utilisateur non trouvé dans Firestore');
            await signOut(auth);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        setError('Erreur lors de la récupération des données utilisateur');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setError('Erreur lors de la déconnexion');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {user ? (
          <>
            <Navbar user={user} onLogout={handleLogout} />
            <div className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/passages" element={<Passages />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/tournees" element={<Tournees />} />
                <Route path="/vehicules" element={<Vehicules />} />
                {user.role === 'Administrateur' && (
                  <Route path="/users" element={<UserManagement />} />
                )}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </>
        ) : (
          <LoginScreen />
        )}
      </div>
    </Router>
  );
};

export default App;