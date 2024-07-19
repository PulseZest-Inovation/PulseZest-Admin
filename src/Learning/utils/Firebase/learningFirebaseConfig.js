import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const LearningfirebaseConfig = {
    apiKey: "AIzaSyBMKu_qb0DMUnaetfAZFwT67XADFfmNHMw",
    authDomain: "pulsezest.firebaseapp.com",
    databaseURL: "https://pulsezest-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pulsezest",
    storageBucket: "pulsezest.appspot.com",
    messagingSenderId: "623743936169",
    appId: "1:623743936169:web:92adcb8e4589e8be8eabb8",
    measurementId: "G-B7C9MEGRRM"
};


// Check if a Firebase app is already initialized
let learningApp;
if (!getApps().length) {
    learningApp = initializeApp(LearningfirebaseConfig, "learningApp");
} else {
    learningApp = getApps().find(app => app.name === "learningApp") || initializeApp(LearningfirebaseConfig, "learningApp");
}

const learningAuth = getAuth(learningApp);
const learningFirestore = getFirestore(learningApp);
const learningDb = learningFirestore;
const learningstorage = getStorage(learningApp)
export { learningApp, learningAuth, learningDb, learningFirestore, learningstorage };
