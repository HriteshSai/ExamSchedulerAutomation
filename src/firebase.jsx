// import firebase from 'firebase';
// import "firebase/auth";
// import "firebase/firestore";

//   const firebaseConfig = {
//     apiKey: "AIzaSyBUwltziPCaKgrG39VrrhNyOps-7liCK3I",
//     authDomain: "esms-d8e3d.firebaseapp.com",
//     databaseURL: "https://esms-d8e3d.firebaseio.com",
//     projectId: "esms-d8e3d",
//     storageBucket: "esms-d8e3d.appspot.com",
//     messagingSenderId: "106290903977",
//     appId: "1:106290903977:web:8404d19fd4fb19e8b1a2b8",
//     measurementId: "G-Y84DNEXKGD"
//   };
 
//  const fire = firebase.initializeApp(firebaseConfig);
//  export default fire;
  


// src/firebase.jsx

// Import core and required services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYNacSgBjG0hHJ7bFdvkdm3SUu-UQIWqw",
  authDomain: "examscheduler-3e38f.firebaseapp.com",
  projectId: "examscheduler-3e38f",
  storageBucket: "examscheduler-3e38f.firebasestorage.app",
  messagingSenderId: "300240682984",
  appId: "1:300240682984:web:8bfe3ace3e8460bf296e5d",
  measurementId: "G-H0CQ7TSH5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Only initialize Analytics if running in the browser
if (typeof window !== "undefined") {
  getAnalytics(app);
}

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

