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

const attendanceSchema = new mongoose.Schema({
  studentId: String,
  date: Date,
  status: { type: String, default: 'Present' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
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
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};