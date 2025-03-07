import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface DashboardStats {
  livraisons: number;
  enCours: number;
  totalColis: number;
  tempsMoyen: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    livraisons: 0,
    enCours: 0,
    totalColis: 0,
    tempsMoyen: '00:00',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simuler des statistiques pour la démonstration
        // Dans une vraie application, ces données proviendraient de Firestore
        setStats({
          livraisons: 235,
          enCours: 42,
          totalColis: 277,
          tempsMoyen: '01:12',
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h2>Tableau de bord</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-title">Colis livrés aujourd'hui</div>
          <div className="stat-value">{stats.livraisons}</div>
          <div className="stat-change">+12% par rapport à hier</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Colis en cours de livraison</div>
          <div className="stat-value">{stats.enCours}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Total des colis</div>
          <div className="stat-value">{stats.totalColis}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Temps moyen de livraison</div>
          <div className="stat-value">{stats.tempsMoyen}</div>
          <div className="stat-change">-5% par rapport à hier</div>
        </div>
      </div>
      
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3 className="chart-title">Activité par heure</h3>
          <div className="chart-placeholder" style={{ height: '200px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Graphique des livraisons par heure
          </div>
        </div>
        
        <div className="chart-container">
          <h3 className="chart-title">Performance par coursier</h3>
          <div className="chart-placeholder" style={{ height: '200px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Graphique des performances par coursier
          </div>
        </div>
      </div>
      
      <div className="chart-container">
        <h3 className="chart-title">Statistiques par site</h3>
        <div className="chart-placeholder" style={{ height: '200px', background: '#f5f5f5', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Graphique des statistiques par site
        </div>
      </div>
    </div>
  );
};

export default Dashboard;