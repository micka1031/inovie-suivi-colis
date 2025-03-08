/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Initialiser l'application Firebase Admin
admin.initializeApp();

// Fonction pour supprimer complètement un utilisateur (v1)
exports.deleteUserCompletely = functions.https.onCall(async (data, context) => {
  const { userId, userEmail } = data;
  
  if (!userId || !userEmail) {
    throw new Error("userId et userEmail sont requis");
  }

  try {
    // Rechercher l'utilisateur dans Firebase Auth par email
    const userRecord = await admin.auth().getUserByEmail(userEmail);
    
    // Supprimer l'utilisateur de Firebase Auth
    await admin.auth().deleteUser(userRecord.uid);
    
    // Supprimer l'utilisateur de Firestore
    await admin.firestore().collection('users').doc(userId).delete();
    
    return { success: true, message: "Utilisateur supprimé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    throw new Error(`Erreur lors de la suppression: ${error.message}`);
  }
});
