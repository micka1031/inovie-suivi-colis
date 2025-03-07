import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { InovieLogo, InovieLogoFooter } from '../assets/inovie-logo';

const LoginScreen: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Construire l'email complet en ajoutant @inovie.fr si ce n'est pas déjà inclus
    const email = identifier.includes('@') ? identifier : `${identifier}@inovie.fr`;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // La redirection est gérée par le composant App grâce à l'état utilisateur
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      // Messages d'erreur plus conviviaux
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
      <div className="login-card">
        <img src={InovieLogo} alt="Inovie" className="login-logo" />
        <h2 className="login-title">Suivi de Colis</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="identifier" className="form-label">Identifiant</label>
            <input
              type="text"
              id="identifier"
              className="form-input"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
              placeholder="Votre identifiant (ex: admin)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="button login-button"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Pour vous connecter, utilisez votre identifiant Inovie</p>
          <p>En cas de problème, contactez votre administrateur</p>
          <img 
            src={InovieLogoFooter} 
            alt="Groupe Inovie" 
            style={{ maxWidth: '180px', marginTop: '1.5rem' }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;