import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
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

export default async function handler(req, res) {
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
}