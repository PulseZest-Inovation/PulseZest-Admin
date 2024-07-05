// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyCaBrxT4HXxYv03gli19ByspDXDkaNFGho",
    authDomain: "pulsezest-ffe99.firebaseapp.com",
    projectId: "pulsezest-ffe99",
    storageBucket: "pulsezest-ffe99.appspot.com",
    messagingSenderId: "434270739454",
    appId: "1:434270739454:web:f011c842e80cc51f1d7eaf",
    measurementId: "G-Z65N3GBVT3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app); // Firebase Authentication
export const storage = getStorage(app); // Firebase Storage
export const db = getFirestore(app); // Firebase Firestore

// Optionally, export app for other services like Firebase Analytics
export { app , analytics };
