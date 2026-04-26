import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
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

export default async function handler(req, res) {
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
}