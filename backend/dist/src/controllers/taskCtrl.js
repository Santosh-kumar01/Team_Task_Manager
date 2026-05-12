"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getTasks = async (req, res) => {
    try {
        let query = {};
        if (req.query.projectId) {
            query.project = req.query.projectId;
        }
        // If not admin, only see assigned tasks
        if (req.user.role !== 'Admin') {
            query.assignedTo = req.user._id;
        }
        const tasks = await Task_1.default.find(query).populate('assignedTo', 'name email').populate('project', 'name');
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    const { title, description, status, dueDate, project, assignedTo } = req.body;
    try {
        const task = await Task_1.default.create({
            title,
            description,
            status,
            dueDate,
            project,
            assignedTo,
            createdBy: req.user._id
        });
        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const { status, assignedTo, dueDate, title, description } = req.body;
    try {
        const task = await Task_1.default.findById(req.params.id);
        if (task) {
            task.status = status || task.status;
            if (req.user.role === 'Admin') {
                task.assignedTo = assignedTo || task.assignedTo;
                task.dueDate = dueDate || task.dueDate;
                task.title = title || task.title;
                task.description = description || task.description;
            }
            const updatedTask = await task.save();
            res.json(updatedTask);
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admins can delete tasks' });
    }
    try {
        const task = await Task_1.default.findById(req.params.id);
        if (task) {
            await task.deleteOne();
            res.json({ message: 'Task removed' });
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteTask = deleteTask;
