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

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  priority: { type: String, default: 'Normal' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    await connectDB();
    const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
    
    if (req.method === 'GET') {
      const announcements = await Announcement.find().sort({ date: -1 });
      return res.status(200).json(announcements);
    }
    
    if (req.method === 'POST') {
      const announcement = new Announcement(req.body);
      const newAnnouncement = await announcement.save();
      return res.status(201).json(newAnnouncement);
    }
    
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await Announcement.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Announcement deleted' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};