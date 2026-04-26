import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  rollNumber: { type: Number, required: true },
  email: String,
  phone: String,
  address: String,
  parentName: String,
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);