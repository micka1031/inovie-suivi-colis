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
  DocumentData,
  CollectionReference
} from 'firebase/firestore';
import { db } from './firebaseConfig';

interface FirebaseQuery {
  collection: string;
  where?: [string, string, any][];
  orderBy?: [string, 'asc' | 'desc'][];
  limit?: number;
}

// Fonction générique pour récupérer tous les documents d'une collection
export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
  const collectionRef = collection(db, collectionName) as CollectionReference<DocumentData>;
  const querySnapshot = await getDocs(collectionRef);
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
  const collectionRef = collection(db, collectionName) as CollectionReference<DocumentData>;
  const docRef = await addDoc(collectionRef, data);
  
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
  await updateDoc(docRef, data as DocumentData);
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
  const collectionRef = collection(db, queryParams.collection) as CollectionReference<DocumentData>;
  let q = collectionRef;

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