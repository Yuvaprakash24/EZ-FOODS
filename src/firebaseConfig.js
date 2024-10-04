// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "", //APIKEYFROMFIREBASEFIRESTORE
  authDomain: "reactbzbootcamp.firebaseapp.com",
  projectId: "reactbzbootcamp",
  storageBucket: "reactbzbootcamp.appspot.com",
  messagingSenderId: "470039057589",
  appId: "1:470039057589:web:00a3cd10c8e14f7ebddafc",
  measurementId: "G-ZZE8J1T0PS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export {app,analytics, db,auth};
