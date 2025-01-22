const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const jsonData = require("./companies.json"); // Adjust path to your JSON file

// Firebase configuration (copy from your firebase.js)
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
const db = getFirestore(app);

const uploadJsonData = async () => {
  try {
    const collectionRef = collection(db, "companies"); // Firestore collection
    for (const item of jsonData) {
      await addDoc(collectionRef, item); // Add each JSON object as a document
    }
    console.log("JSON data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading JSON data:", error);
  }
};

uploadJsonData();