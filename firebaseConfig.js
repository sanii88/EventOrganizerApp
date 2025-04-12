import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBDL5CGF5qeszVSLbXwTaa5NVtVWimcilw",
    authDomain: "info6129-ea48a.firebaseapp.com",
    projectId: "info6129-ea48a",
    storageBucket: "info6129-ea48a.firebasestorage.app",
    messagingSenderId: "1041276521082",
    appId: "1:1041276521082:web:f1fee6c6724f3e46d449c3",
    measurementId: "G-6ECJ5M5Q8E"
  };



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };