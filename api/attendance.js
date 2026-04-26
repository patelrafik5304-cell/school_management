import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

const attendanceSchema = new mongoose.Schema({
  studentId: String,
  date: Date,
  status: { type: String, default: 'Present' },
  createdAt: { type: Date, default: Date.now }
});

export default async function handler(req, res) {
  await connectDB();
  const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
  
  if (req.method === 'GET') {
    const { date } = req.query;
    const query = date ? { date: new Date(date) } : {};
    const attendance = await Attendance.find(query).sort({ date: -1 });
    return res.status(200).json(attendance);
  }
  
  if (req.method === 'POST') {
    const attendance = new Attendance(req.body);
    const newAttendance = await attendance.save();
    return res.status(201).json(newAttendance);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}