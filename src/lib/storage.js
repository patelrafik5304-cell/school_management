import { storage, ref, uploadBytes, getDownloadURL } from './firebase';

export async function uploadImage(file) {
  if (!file) {
    throw new Error('No file provided');
  }
  
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `gallery/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    return url;
  } catch (e) {
    console.error('Upload error:', e);
    throw new Error('Upload failed: ' + e.message);
  }
}