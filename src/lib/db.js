// Lazy Firebase initialization
let firestoreDb = null;
let firebaseApp = null;

const getFirebaseConfig = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});

async function getDb() {
  if (firestoreDb) return firestoreDb;

  const { initializeApp } = await import("firebase/app");
  const { getFirestore } = await import("firebase/firestore");

  if (!firebaseApp) {
    firebaseApp = initializeApp(getFirebaseConfig());
  }

  firestoreDb = getFirestore(firebaseApp);
  return firestoreDb;
}

// Helper to get collection references lazily
let _studentsRef, _attendanceRef, _resultsRef, _staffRef, _announcementsRef, _imagesRef;

async function getStudentsRef() {
  if (_studentsRef) return _studentsRef;
  const { collection } = await import("firebase/firestore");
  const db = await getDb();
  _studentsRef = collection(db, 'students');
  return _studentsRef;
}

async function getAttendanceRef() {
  if (_attendanceRef) return _attendanceRef;
  const { collection } = await import("firebase/firestore");
  const db = await getDb();
  _attendanceRef = collection(db, 'attendance');
  return _attendanceRef;
}

async function getResultsRef() {
  if (_resultsRef) return _resultsRef;
  const { collection } = await import("firebase/firestore");
  const db = await getDb();
  _resultsRef = collection(db, 'results');
  return _resultsRef;
}

async function getStaffRef() {
  if (_staffRef) return _staffRef;
  const { collection } = await import("firebase/firestore");
  const db = await getDb();
  _staffRef = collection(db, 'staff');
  return _staffRef;
}

async function getAnnouncementsRef() {
  if (_announcementsRef) return _announcementsRef;
  const { collection } = await import("firebase/firestore");
  const db = await getDb();
  _announcementsRef = collection(db, 'announcements');
  return _announcementsRef;
}

async function getImagesRef() {
  if (_imagesRef) return _imagesRef;
  const { collection } = await import("firebase/firestore");
  const db = await getDb();
  _imagesRef = collection(db, 'images');
  return _imagesRef;
}

export async function getAllStudents() {
  const { query, orderBy, getDocs } = await import("firebase/firestore");
  const ref = await getStudentsRef();
  const q = query(ref, orderBy('rollNumber'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addStudent(data) {
  const { addDoc } = await import("firebase/firestore");
  const cleanName = data.name.toLowerCase().replace(/\s+/g, '').slice(0, 4);
  const username = `${cleanName}${data.rollNumber}`;
  const password = `${cleanName}@${data.rollNumber}`;
  const ref = await getStudentsRef();
  const docRef = await addDoc(ref, { ...data, username, password, status: 'Active' });
  return { id: docRef.id, username, password };
}

export async function deleteStudent(id) {
  const { deleteDoc, doc } = await import("firebase/firestore");
  const db = await getDb();
  await deleteDoc(doc(db, 'students', id));
}

export async function getStudentById(id) {
  const { getDoc, doc } = await import("firebase/firestore");
  const db = await getDb();
  const docSnap = await getDoc(doc(db, 'students', id));
  if (!docSnap.exists()) throw new Error('Student not found');
  return { id: docSnap.id, ...docSnap.data() };
}

/**
 * SECURITY WARNING: Querying passwords in plain text is highly insecure.
 * Transition to Firebase Authentication (signInWithEmailAndPassword)
 * as soon as possible.
 */
export async function loginStudent(username, password) {
  const { query, where, getDocs } = await import("firebase/firestore");
  const ref = await getStudentsRef();
  const q = query(ref, where('username', '==', username), where('password', '==', password));
  const snapshot = await getDocs(q);
  if (snapshot.empty) throw new Error('Invalid credentials');
  const student = snapshot.docs[0];
  return { id: student.id, ...student.data() };
}

export async function getAllAttendance(date) {
  const { query, where, getDocs } = await import("firebase/firestore");
  const ref = await getAttendanceRef();
  const q = query(ref, where('date', '==', date));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function getAttendanceByStudent(studentId) {
  const { query, where, getDocs } = await import("firebase/firestore");
  const ref = await getAttendanceRef();
  const q = query(ref, where('studentId', '==', studentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addAttendance(data) {
  const { addDoc } = await import("firebase/firestore");
  const ref = await getAttendanceRef();
  const docRef = await addDoc(ref, data);
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function getAllResults() {
  const { query, orderBy, getDocs } = await import("firebase/firestore");
  const ref = await getResultsRef();
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function getResultsByStudent(studentId) {
  const { query, where, getDocs } = await import("firebase/firestore");
  const ref = await getResultsRef();
  const q = query(ref, where('studentId', '==', studentId));
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
  const { addDoc } = await import("firebase/firestore");
  const ref = await getResultsRef();
  const docRef = await addDoc(ref, { ...data, createdAt: new Date() });
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function updateResult(id, data) {
  const { updateDoc, doc } = await import("firebase/firestore");
  const db = await getDb();
  await updateDoc(doc(db, 'results', id), data);
}

export async function deleteResult(id) {
  const { deleteDoc, doc } = await import("firebase/firestore");
  const db = await getDb();
  await deleteDoc(doc(db, 'results', id));
}

export async function getAllStaff() {
  const { getDocs } = await import("firebase/firestore");
  const ref = await getStaffRef();
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addStaff(data) {
  const { addDoc } = await import("firebase/firestore");
  const ref = await getStaffRef();
  const docRef = await addDoc(ref, data);
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function updateStaff(id, data) {
  const { updateDoc, doc } = await import("firebase/firestore");
  const db = await getDb();
  await updateDoc(doc(db, 'staff', id), data);
}

export async function getAllAnnouncements() {
  const { query, orderBy, getDocs } = await import("firebase/firestore");
  const ref = await getAnnouncementsRef();
  const q = query(ref, orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  // SECURITY: Removed client-side deletion. Automated cleanup should
  // be handled by a Scheduled Cloud Function, not the client's browser.
  return snapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
}

export async function addAnnouncement(data) {
  const { addDoc } = await import("firebase/firestore");
  const ref = await getAnnouncementsRef();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
  const docRef = await addDoc(ref, { ...data, date: new Date(), expiresAt });
  return { id: docRef.id, _id: docRef.id, ...data, expiresAt };
}

export async function deleteAnnouncement(id) {
  const { deleteDoc, doc } = await import("firebase/firestore");
  const db = await getDb();
  await deleteDoc(doc(db, 'announcements', id));
}

export async function getAllImages(maxItems = 24) {
  const { query, orderBy, getDocs, limit } = await import("firebase/firestore");
  const ref = await getImagesRef();
  const q = query(ref, orderBy('createdAt', 'desc'), limit(maxItems));
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
  const { addDoc } = await import("firebase/firestore");
  const ref = await getImagesRef();
  const docRef = await addDoc(ref, { ...data, createdAt: new Date() });
  return { id: docRef.id, _id: docRef.id, ...data };
}

export async function deleteImage(id) {
  const { deleteDoc, doc } = await import("firebase/firestore");
  const db = await getDb();
  await deleteDoc(doc(db, 'images', id));
}
