import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

const staffSchema = new mongoose.Schema({
  name: String,
  role: String,
  email: String,
  phone: String,
  experience: String,
  qualification: String,
  subject: String,
  createdAt: { type: Date, default: Date.now }
});

export default async function handler(req, res) {
  await connectDB();
  const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);
  
  if (req.method === 'GET') {
    const staff = await Staff.find();
    return res.status(200).json(staff);
  }
  
  if (req.method === 'POST') {
    const member = new Staff(req.body);
    const newMember = await member.save();
    return res.status(201).json(newMember);
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}