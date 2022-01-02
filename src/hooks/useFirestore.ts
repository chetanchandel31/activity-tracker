import { useEffect, useState } from "react";
import { firestore } from "../firebase/firebase";
import firebase from "firebase";

const useFirestore = (collection: string) => {
  // type Doc =
  //   | {
  //       [key: string]: any;
  //     }
  //   | DocumentType;

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
