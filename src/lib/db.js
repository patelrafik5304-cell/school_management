import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where } from "firebase/firestore";

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

export async function addAttendance(data) {
  const docRef = await addDoc(attendanceRef, data);
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function getAllResults() {
  const q = query(resultsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addResult(data) {
  const docRef = await addDoc(resultsRef, { ...data, createdAt: new Date() });
  return { id: docRef.id, _id: docRef.id, ...data };
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

export async function getAllImages() {
  const q = query(imagesRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addImage(data) {
  const docRef = await addDoc(imagesRef, { ...data, createdAt: new Date() });
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function deleteImage(id) {
  await deleteDoc(doc(db, 'images', id));
}