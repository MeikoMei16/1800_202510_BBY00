// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const myAPI: string = import.meta.env.VITE_FIREBASE_API;

const firebaseConfig = {
    apiKey: myAPI,
    authDomain: "bby-00-comp1800.firebaseapp.com",
    projectId: "bby-00-comp1800",
    storageBucket: "bby-00-comp1800.firebasestorage.app",
    messagingSenderId: "927805471010",
    appId: "1:927805471010:web:8563c61b1beb80c1cbcd7b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
