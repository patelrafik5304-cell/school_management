import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqlHLlwyO4Q0CeowDoV_8dtzI_Mni7pIE",
  authDomain: "schoolmanagement-4734f.firebaseapp.com",
  projectId: "schoolmanagement-4734f",
  storageBucket: "schoolmanagement-4734f.firebasestorage.app",
  messagingSenderId: "717395679779",
  appId: "1:717395679779:web:867e51284281317e1caf96",
  measurementId: "G-LQJF0FJEKG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, ref, uploadBytes, getDownloadURL };