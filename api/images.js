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

const imageSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: { type: String, default: 'gallery' },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    await connectDB();
    const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);
    
    if (req.method === 'GET') {
      const images = await Image.find().sort({ createdAt: -1 });
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
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};