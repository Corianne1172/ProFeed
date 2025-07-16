import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  professorId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Class', classSchema);