import firebase from "firebase-config/firebase";

interface Args {
  collectionRef: firebase.firestore.CollectionReference<firebase.firestore.DocumentData>;
  docId: string;
  merge?: boolean;
  updatedDoc: object;
}

/** edit any firestore doc. if `merge` isn't passed as `false`, it merges new fields instead of overwriting entire firestore document */
export const editFirestoreDoc = async ({
  collectionRef,
  docId,
  merge = true,
  updatedDoc,
}: Args) => await collectionRef.doc(docId).set(updatedDoc, { merge });
