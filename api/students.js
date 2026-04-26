import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cachedConnection.conn) {
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    
    cachedConnection.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  
  cachedConnection.conn = await cachedConnection.promise;
  return cachedConnection.conn;
}

const studentSchema = new mongoose.Schema({
  name: String,
  class: String,
  rollNumber: Number,
  email: String,
  phone: String,
  address: String,
  parentName: String,
  username: { type: String, unique: true, sparse: true },
  password: { type: String },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

function generateCredentials(name, rollNumber) {
  const cleanName = name.toLowerCase().replace(/\s+/g, '').slice(0, 4);
  return {
    username: `${cleanName}${rollNumber}`,
    password: `${cleanName}@${rollNumber}`
  };
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    await connectDB();
    const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
    
    if (req.method === 'GET') {
      const students = await Student.find().sort({ rollNumber: 1 });
      return res.status(200).json(students);
    }
    
    if (req.method === 'POST') {
      const { name, class: studentClass, rollNumber, email, phone, address, parentName } = req.body;
      const credentials = generateCredentials(name, rollNumber);
      const student = new Student({
        name,
        class: studentClass,
        rollNumber,
        email,
        phone,
        address,
        parentName,
        username: credentials.username,
        password: credentials.password
      });
      const newStudent = await student.save();
      return res.status(201).json({ ...newStudent.toObject(), autoPassword: credentials.password });
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Student.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Student deleted' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};