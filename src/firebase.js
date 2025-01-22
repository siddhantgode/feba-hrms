// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (new configuration)
const firebaseConfig = {
  apiKey: "AIzaSyC-weBB79D4KbFSfaTdUvOdLalIE13OM64",
  authDomain: "hrms-feba-2.firebaseapp.com",
  projectId: "hrms-feba-2",
  storageBucket: "hrms-feba-2.firebasestorage.app",
  messagingSenderId: "50827221270",
  appId: "1:50827221270:web:1be3cc7ef8aa87e8329837",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db;