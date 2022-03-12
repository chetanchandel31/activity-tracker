import firebase from "firebase-config/firebase";

export const deleteFirestoreDoc = async (
  collectionRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>,
  docId: string
) => await collectionRef.doc(docId).delete();
