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
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export default async function handler(req, res) {
  await connectDB();
  const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
  
  if (req.method === 'GET') {
    const students = await Student.find().sort({ rollNumber: 1 });
    return res.status(200).json(students);
  }
  
  if (req.method === 'POST') {
    const student = new Student(req.body);
    const newStudent = await student.save();
    return res.status(201).json(newStudent);
  }
  
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Student.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Student deleted' });
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}