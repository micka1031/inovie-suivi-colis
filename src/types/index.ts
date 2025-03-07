import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  nom: string;
  identifiant: string;
  role: string;
  pole: string;
  statut: 'actif' | 'inactif';
  derniereConnexion: Timestamp | null;
}

export interface Passage {
  id: string;
  idColis: string;
  siteDepart: string;
  siteFin: string;
  dateHeureDepart: Timestamp;
  dateHeureLivraison: Timestamp | null;
  statut: string;
  coursierChargement: string;
  coursierLivraison: string | null;
  vehicule: string;
  tourneeId: string;
  tournee?: string;
}

export interface Site {
  id: string;
  nom: string;
}

export interface Tournee {
  id: string;
  nom: string;
}

export interface Vehicule {
  id: string;
  nom: string;
}
