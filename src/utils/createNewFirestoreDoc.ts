import firebase from "firebase";

interface Args {
  collectionRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  docId?: string;
  doc: object;
}

export const createNewFirestoreDoc = async ({
  collectionRef,
  docId,
  doc,
}: Args) => {
  if (!docId) return await collectionRef.add(doc);
  else return await collectionRef.doc(docId).set(doc);
};
