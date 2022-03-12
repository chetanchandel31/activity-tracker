import firebase from "firebase-config/firebase";

interface Args {
  collectionRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  docId: string;
  merge?: boolean;
  updatedDoc: object;
}

export const editFirestoreDoc = async ({
  collectionRef,
  docId,
  merge = true,
  updatedDoc,
}: Args) => await collectionRef.doc(docId).set(updatedDoc, { merge });
