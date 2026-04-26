import { initializeApp } from "firebase/app";
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
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };

export async function uploadImage(file) {
  const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}