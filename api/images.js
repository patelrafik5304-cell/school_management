import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

const imageSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: String, default: 'gallery' },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default async function handler(req, res) {
  await connectDB();
  const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);
  
  if (req.method === 'GET') {
    const { category } = req.query;
    const query = category ? { category } : {};
    const images = await Image.find(query).sort({ createdAt: -1 });
    return res.status(200).json(images);
  }
  
  if (req.method === 'POST') {
    const image = new Image(req.body);
    const saved = await image.save();
    return res.status(201).json(saved);
  }
  
  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Image.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Image deleted' });
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
}