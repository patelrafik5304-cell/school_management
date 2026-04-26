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

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    await connectDB();
    const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
    
    if (req.method === 'POST') {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }
      
      const student = await Student.findOne({ username, password, status: 'Active' });
      
      if (!student) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      return res.status(200).json({
        _id: student._id,
        name: student.name,
        class: student.class,
        rollNumber: student.rollNumber,
        username: student.username,
        message: 'Login successful'
      });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};