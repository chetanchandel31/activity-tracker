import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyBPFIpOWZ0v-0QlRVrG9m5xzQ-XYgrb-7k",
  authDomain: "activity-tracker-c7416.firebaseapp.com",
  projectId: "activity-tracker-c7416",
  storageBucket: "activity-tracker-c7416.appspot.com",
  messagingSenderId: "286384408879",
  appId: "1:286384408879:web:6a5dddcc4adb559879b9da",
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export default firebase;
