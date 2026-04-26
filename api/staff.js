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

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
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
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};