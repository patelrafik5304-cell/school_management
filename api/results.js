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

const resultSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  studentClass: String,
  subject: String,
  marks: Number,
  maxMarks: { type: Number, default: 100 },
  examType: { type: String, default: 'Monthly' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    await connectDB();
    const Result = mongoose.models.Result || mongoose.model('Result', resultSchema);
    
    if (req.method === 'GET') {
      const results = await Result.find().sort({ createdAt: -1 });
      return res.status(200).json(results);
    }
    
    if (req.method === 'POST') {
      const result = new Result(req.body);
      const newResult = await result.save();
      return res.status(201).json(newResult);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};