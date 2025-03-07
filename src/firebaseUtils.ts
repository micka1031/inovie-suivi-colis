import { 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { FirebaseQuery, Site, Passage, Vehicule } from './types';

// Fonction générique pour récupérer tous les documents d'une collection
export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as T[];
};

// Fonction générique pour récupérer un document par son ID
export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as T;
  }
  return null;
};

// Fonction générique pour ajouter un document
export const addDocument = async <T extends { id?: string }>(
  collectionName: string,
  data: Omit<T, 'id'>
): Promise<T> => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    // Convertir les dates en Timestamp si nécessaire
    ...(data as any).dateHeureDepart && {
      dateHeureDepart: Timestamp.fromDate(new Date((data as any).dateHeureDepart))
    },
    ...(data as any).dateHeureLivraison && {
      dateHeureLivraison: Timestamp.fromDate(new Date((data as any).dateHeureLivraison))
    },
    ...(data as any).derniereConnexion && {
      derniereConnexion: Timestamp.fromDate(new Date((data as any).derniereConnexion))
    }
  });
  
  return {
    id: docRef.id,
    ...data
  } as T;
};

// Fonction générique pour mettre à jour un document
export const updateDocument = async <T>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    // Convertir les dates en Timestamp si nécessaire
    ...(data as any).dateHeureDepart && {
      dateHeureDepart: Timestamp.fromDate(new Date((data as any).dateHeureDepart))
    },
    ...(data as any).dateHeureLivraison && {
      dateHeureLivraison: Timestamp.fromDate(new Date((data as any).dateHeureLivraison))
    },
    ...(data as any).derniereConnexion && {
      derniereConnexion: Timestamp.fromDate(new Date((data as any).derniereConnexion))
    }
  });
};

// Fonction générique pour supprimer un document
export const deleteDocument = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// Fonction générique pour effectuer une requête complexe
export const queryCollection = async <T>(
  queryParams: FirebaseQuery
): Promise<T[]> => {
  let q = collection(db, queryParams.collection);

  if (queryParams.where) {
    queryParams.where.forEach(([field, operator, value]) => {
      q = query(q, where(field, operator, value));
    });
  }

  if (queryParams.orderBy) {
    queryParams.orderBy.forEach(([field, direction]) => {
      q = query(q, orderBy(field, direction));
    });
  }

  if (queryParams.limit) {
    q = query(q, limit(queryParams.limit));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as T[];
};

const sites = await getCollection<Site>('sites');

const newPassage = await addDocument<Passage>('passages', {
  siteDepart: "Site A",
  dateHeureDepart: new Date(),
  idColis: "COLIS001",
  statut: "En cours",
  siteFin: "Site B",
  dateHeureLivraison: null,
  coursierChargement: "John Doe",
  coursierLivraison: null,
  vehicule: "AA-123-BB",
  tournee: "TOUR001"
});

await updateDocument<Vehicule>('vehicules', 'ID_DU_VEHICULE', {
  statut: "En maintenance"
}); 