"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done', 'todo', 'in_progress', 'done'], default: 'To Do' },
    priority: { type: String, enum: ['High', 'Medium', 'Low', 'high', 'medium', 'low'], default: 'Medium' },
    dueDate: { type: Date },
    project: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Task', taskSchema);
