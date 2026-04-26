import { db, imagesRef } from './db';
import { addDoc } from "firebase/firestore";

export async function uploadImage(file) {
  if (!file) {
    throw new Error('No file provided');
  }
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const docRef = await addDoc(imagesRef, {
          title: file.name,
          url: base64,
          createdAt: new Date()
        });
        resolve(base64);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}