import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { InovieLogoFooter } from '../assets/inovie-logo';
import './LoginScreen.css';

const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const email = identifier.includes('@') ? identifier : `${identifier}@inovie.fr`;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      if (error.code === 'auth/invalid-credential') {
        setError('Identifiant ou mot de passe incorrect.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
      } else {
        setError('Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img 
          src={InovieLogoFooter} 
          alt="Groupe Inovie" 
          className="header-logo"
        />
        <h2 className="login-title">INOVIE SCAN</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="identifier">Identifiant</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
              placeholder="Votre identifiant (ex: admin)"
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
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <footer className="login-footer">
          <p>Pour vous connecter, utilisez votre identifiant Inovie</p>
          <p>En cas de problème, contactez votre <a href="mailto:mickael.volle@inovie.fr">administrateur</a></p>
        </footer>
      </div>
      <p className="version">version 1.0</p>
    </div>
  );
};

export default LoginScreen;