import React, { useState } from 'react';
import { createAdminUser } from '../firebaseAuth';
import { User } from '../types';
import './LoginScreen.css';

interface AdminRegistrationProps {
  onRegistration: (user: User) => void;
}

const AdminRegistration: React.FC<AdminRegistrationProps> = ({ onRegistration }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [pole, setPole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await createAdminUser(email, password, nom, pole);
      onRegistration(user);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Création Compte Administrateur</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label htmlFor="nom">Nom complet</label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pole">Pôle</label>
            <input
              type="text"
              id="pole"
              value={pole}
              onChange={(e) => setPole(e.target.value)}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Création en cours...' : 'Créer le compte'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration; 