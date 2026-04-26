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

function generateCredentials(name, rollNumber) {
  const cleanName = name.toLowerCase().replace(/\s+/g, '').slice(0, 4);
  return {
    username: `${cleanName}${rollNumber}`,
    password: `${cleanName}@${rollNumber}`
  };
}

export default async function handler(req, res) {
  await connectDB();
  const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
  
  if (req.method === 'GET') {
    const { id } = req.query;
    if (id) {
      const student = await Student.findById(id);
      return res.status(200).json(student);
    }
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
  
  if (req.method === 'PUT') {
    const { id } = req.query;
    const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}