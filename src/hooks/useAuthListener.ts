import firebase from "firebase";
import { auth } from "firebase-config/firebase";
import { useEffect, useState } from "react";

function useAuthListener() {
  const [storedUser, setStoredUser] = useState<firebase.User | null>(
    JSON.parse(localStorage.getItem("authenticated-user") as string)
  );

  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem("authenticated-user", JSON.stringify(user));
        setStoredUser(user);
      } else {
        localStorage.removeItem("authenticated-user");
        setStoredUser(null);
      }
    });

    return () => listener();
  }, []);

  return [storedUser];
}

export default useAuthListener;
