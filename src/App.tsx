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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('identifiant', '==', 'admin'));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            setUser({
              id: userDoc.id,
              ...userData
            });
          } else {
            const adminData = {
              identifiant: 'admin',
              nom: 'Administrateur',
              role: 'Administrateur',
              pole: 'Administration',
              statut: 'actif',
              dateCreation: new Date()
            };
            const adminRef = doc(usersRef, 'admin');
            await setDoc(adminRef, adminData);
            setUser({
              id: 'admin',
              ...adminData
            });
          }
        } catch (error) {
          console.error('Erreur:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Router>
      {user ? (
        <div className="app">
          <Navbar user={user} onLogout={handleLogout} />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/passages" element={<Passages />} />
              <Route path="/sites" element={<Sites />} />
              <Route path="/tournees" element={<Tournees />} />
              <Route path="/vehicules" element={<Vehicules />} />
              <Route
                path="/admin/users"
                element={
                  user.role === 'Administrateur' ? (
                    <UserManagement />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </main>
        </div>
      ) : (
        <LoginScreen />
      )}
    </Router>
  );
};

export default App;