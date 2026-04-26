export async function uploadImage(file) {
  const UPLOADTHING_KEY = import.meta.env.VITE_UPLOADTHING_KEY;
  
  if (!UPLOADTHING_KEY) {
    throw new Error('UploadThing key not configured. Add VITE_UPLOADTHING_KEY in Vercel.');
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('https://uploadthing.com/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${UPLOADTHING_KEY}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  const data = await response.json();
  return data.url;
}