import firebase from "firebase";
import { auth } from "firebase-config/firebase";
import { useEffect, useState } from "react";

const AUTHENTICATED_USER = "authenticated-user";

function useAuthListener() {
  const [storedUser, setStoredUser] = useState<firebase.User | null>(
    JSON.parse(localStorage.getItem(AUTHENTICATED_USER) as string)
  );

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem(AUTHENTICATED_USER, JSON.stringify(user));
        setStoredUser(user);
      } else {
        localStorage.removeItem(AUTHENTICATED_USER);
        setStoredUser(null);
      }
    });

    return () => listener();
  }, []);

  return [storedUser];
}

export default useAuthListener;
