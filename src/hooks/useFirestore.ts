import firebase from "firebase";
import { firestore } from "firebase-config/firebase";
import { useEffect, useState } from "react";

const useFirestore = (collection: string) => {
  const [docs, setDocs] = useState<any[] | null>(null);

  useEffect(() => {
    const unsub = firestore
      .collection(collection)
      // .orderBy("createdAt", "desc")
      .onSnapshot(
        (
          snap: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
        ) => {
          let documents: any[] = [];
          snap.forEach(
            (
              doc: firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>
            ) => documents.push({ ...doc.data(), id: doc.id })
          );
          setDocs(documents);
        }
      );

    return () => unsub();
  }, [collection]);

  return { docs };
};

export default useFirestore;
