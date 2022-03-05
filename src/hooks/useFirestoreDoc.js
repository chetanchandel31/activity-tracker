import { firestore } from "firebase-config/firebase";
import { useEffect, useState } from "react";

const useFirestoreDoc = (collection, docId) => {
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const unsub = firestore
      .collection(collection)
      .doc(docId)
      .onSnapshot((snap) => {
        let document;
        document = snap.data();
        setDoc(document);
      });

    return () => unsub();
    // eslint-disable-next-line
  }, [collection]);

  return { doc };
};

export default useFirestoreDoc;
