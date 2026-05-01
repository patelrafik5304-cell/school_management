import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, addDoc, deleteDoc, doc, query, orderBy, where, updateDoc, limit as firestoreLimit } from "firebase/firestore";

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

export { db, app };

export const studentsRef = collection(db, 'students');
export const attendanceRef = collection(db, 'attendance');
export const resultsRef = collection(db, 'results');
export const staffRef = collection(db, 'staff');
export const announcementsRef = collection(db, 'announcements');
export const imagesRef = collection(db, 'images');

export async function getAllStudents() {
  const q = query(studentsRef, orderBy('rollNumber'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addStudent(data) {
  const cleanName = data.name.toLowerCase().replace(/\s+/g, '').slice(0, 4);
  const username = `${cleanName}${data.rollNumber}`;
  const password = `${cleanName}@${data.rollNumber}`;
  const docRef = await addDoc(studentsRef, { ...data, username, password, status: 'Active' });
  return { id: docRef.id, username, password };
}

export async function deleteStudent(id) {
  await deleteDoc(doc(db, 'students', id));
}

export async function getStudentById(id) {
  const docSnap = await getDoc(doc(db, 'students', id));
  if (!docSnap.exists()) throw new Error('Student not found');
  return { id: docSnap.id, ...docSnap.data() };
}

export async function loginStudent(username, password) {
  const q = query(studentsRef, where('username', '==', username), where('password', '==', password));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error('Invalid credentials');
  const student = snapshot.docs[0];
  return { id: student.id, ...student.data() };
}

export async function getAllAttendance(date) {
  const q = query(attendanceRef, where('date', '==', date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function getAttendanceByStudent(studentId) {
  const q = query(attendanceRef, where('studentId', '==', studentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addAttendance(data) {
  const docRef = await addDoc(attendanceRef, data);
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function getAllResults() {
  const q = query(resultsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function getResultsByStudent(studentId) {
  const q = query(resultsRef, where('studentId', '==', studentId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(d => ({ id: d.id, _id: d.id, ...d.data() }))
    .sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() || 0;
      const bTime = b.createdAt?.toMillis?.() || 0;
      return bTime - aTime;
    });
}

export async function getPublishedResultsByStudent(studentId) {
  const results = await getResultsByStudent(studentId);
  return results.filter(result => result.status === 'published');
}

export async function addResult(data) {
  const docRef = await addDoc(resultsRef, { ...data, createdAt: new Date() });
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function updateResult(id, data) {
  await updateDoc(doc(db, 'results', id), data);
}

export async function deleteResult(id) {
  await deleteDoc(doc(db, 'results', id));
}

export async function getAllStaff() {
  const snapshot = await getDocs(staffRef);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function getAllAnnouncements() {
  const q = query(announcementsRef, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addAnnouncement(data) {
  const docRef = await addDoc(announcementsRef, { ...data, date: new Date() });
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function deleteAnnouncement(id) {
  await deleteDoc(doc(db, 'announcements', id));
}

export async function getAllImages(maxItems = 24) {
  const q = query(imagesRef, orderBy('createdAt', 'desc'), firestoreLimit(maxItems));
  const snapshot = await getDocs(q);
  const all = snapshot.docs.map(d => {
    const data = d.data();
    const source = data.imageUrl || data.url || '';
    return {
      id: d.id,
      _id: d.id,
      ...data,
      url: source,
      imageUrl: source
    };
  });
  const map = new Map();
  all.forEach(img => {
    const key = img.imageUrl || img.url || img.id;
    const existing = map.get(key);
    if (!existing) {
      map.set(key, img);
      return;
    }

    const existingScore = Number(Boolean(existing.description)) + Number(Boolean(existing.tags)) + Number(Boolean(existing.uploadedAt)) + Number(Boolean(existing.imageUrl));
    const currentScore = Number(Boolean(img.description)) + Number(Boolean(img.tags)) + Number(Boolean(img.uploadedAt)) + Number(Boolean(img.imageUrl));
    if (currentScore >= existingScore) {
      map.set(key, { ...existing, ...img, url: key, imageUrl: key });
    }
  });
  return Array.from(map.values());
}

export async function addImage(data) {
  const docRef = await addDoc(imagesRef, { ...data, createdAt: new Date() });
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function deleteImage(id) {
  await deleteDoc(doc(db, 'images', id));
}
