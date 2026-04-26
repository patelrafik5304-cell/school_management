import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

const announcementSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  priority: { type: String, default: 'Normal' },
  createdAt: { type: Date, default: Date.now }
});

export default async function handler(req, res) {
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
}