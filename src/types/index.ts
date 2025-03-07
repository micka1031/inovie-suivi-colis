import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'Utilisateur' | 'Administrateur';
  pole?: string;
  dateCreation: string;
  dernierAcces?: string;
}

export interface Passage {
  id: string;
  idColis: string;
  siteDepart: string;
  siteFin: string;
  dateHeureDepart: string;
  dateHeureFin?: string;
  statut: 'En attente' | 'En cours' | 'Livré' | 'Problème';
  tourneeId?: string;
  vehiculeId?: string;
  commentaire?: string;
}

export interface Site {
  id: string;
  nom: string;
  codeBarres: string;
  pole: string;
  ville: string;
  adresse: string;
  telephone?: string;
  email?: string;
}

export interface Tournee {
  id: string;
  nom: string;
  codeBarres: string;
  pole: string;
  vehiculeId?: string;
  personne?: string;
  dateDebut: string;
  dateFin?: string;
  statut: string;
  commentaire?: string;
}

export interface Vehicule {
  id: string;
  nom: string;
  type: string;
  marque: string;
  modele: string;
  immatriculation: string;
  statut: 'Disponible' | 'En service' | 'En maintenance';
}
