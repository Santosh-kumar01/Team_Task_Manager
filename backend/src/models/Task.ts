import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done', 'todo', 'in_progress', 'done'], default: 'To Do' },
  priority: { type: String, enum: ['High', 'Medium', 'Low', 'high', 'medium', 'low'], default: 'Medium' },
  dueDate: { type: Date },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);
