// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore, doc, setDoc} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSbjOrKY9mF0XoBP8CAH-WobSy_MRpOAs",
  authDomain: "financely-c89ba.firebaseapp.com",
  projectId: "financely-c89ba",
  storageBucket: "financely-c89ba.appspot.com",
  messagingSenderId: "968065644137",
  appId: "1:968065644137:web:550b120bd14c7a224154f8",
  measurementId: "G-G3JPM94SHJ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth  = getAuth(app);
const provider = new GoogleAuthProvider(app);

export {db, auth, provider,doc,setDoc}