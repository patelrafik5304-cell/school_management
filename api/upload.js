export default async function handler(req, res) {
  const uploadKey = process.env.UPLOADTHING_KEY;
  
  if (!uploadKey) {
    return res.status(500).json({ message: 'UploadThing key not configured' });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { imageUrl, title } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL required' });
    }
    
    // Return a success response
    // The actual upload to UploadThing would happen here
    // For now, we'll store the URL directly in MongoDB
    return res.status(200).json({
      url: imageUrl,
      message: 'Image URL ready for storage'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error processing upload' });
  }
}