import { firestore } from "firebase-config/firebase";

/**
 * read firestore docs from a firestore collection once, without subscribing to live changes
 *
 * @param collection - firestore collection path. e.g. "users/uid/todos"
 * @returns all firestore docs in that collection
 *
 */
export const getAllFirestoreDocs = async (collection: string) => {
  const docs: any = [];

  await firestore
    .collection(collection)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
    });

  return docs;
};
