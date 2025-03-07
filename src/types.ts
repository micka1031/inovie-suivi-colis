import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: 'Administrateur' | 'Utilisateur';
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
  statut: 'En attente' | 'En cours' | 'Terminée' | 'Annulée';
  pole: string;
  personne?: string;
  vehiculeId?: string;
  dateDebut: string;
  dateFin?: string;
  commentaire?: string;
}

export interface Vehicule {
  id: string;
  immatriculation: string;
  marque: string;
  modele: string;
  typeCarburant: 'Essence' | 'Diesel' | 'Électrique' | 'Hybride';
  pole: string;
  service: string;
  disponible: boolean;
  commentaire?: string;
}

export interface FirebaseQuery {
  collection: string;
  where?: [string, "==" | "!=" | ">" | ">=" | "<" | "<=", any][];
  orderBy?: [string, "asc" | "desc"][];
  limit?: number;
}