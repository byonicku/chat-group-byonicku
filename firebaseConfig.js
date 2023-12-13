// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCM598KDxix9JvJ-yGmCePmM7Ub2nhiwLg",
  authDomain: "pw-firebase-11227.firebaseapp.com",
  projectId: "pw-firebase-11227",
  storageBucket: "pw-firebase-11227.appspot.com",
  messagingSenderId: "647753280558",
  appId: "1:647753280558:web:a5f69c90e3547e554d83bf",
  databaseURL: "https://pw-firebase-11227-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
const signInProvider = new GoogleAuthProvider();
signInProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
export const auth = getAuth(app);
export default app;

// Firebase Realtime Database
export const db = getDatabase(app);
export const DB_TODO_KEY = 'todos';