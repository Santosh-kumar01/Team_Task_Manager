"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.createProject = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const Task_1 = __importDefault(require("../models/Task"));
const getProjects = async (req, res) => {
    try {
        const projects = await Project_1.default.find({ $or: [{ members: req.user._id }, { createdBy: req.user._id }] }).populate('members', 'name email').lean();
        const projectsWithProgress = await Promise.all(projects.map(async (project) => {
            const totalTasks = await Task_1.default.countDocuments({ project: project._id });
            const doneTasks = await Task_1.default.countDocuments({ project: project._id, status: { $in: ['Done', 'done'] } });
            return { ...project, totalTasks, doneTasks };
        }));
        res.json(projectsWithProgress);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProjects = getProjects;
const createProject = async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admins can create projects' });
    }
    const { name, description, members } = req.body;
    try {
        const project = await Project_1.default.create({
            name,
            description,
            members,
            createdBy: req.user._id
        });
        res.status(201).json(project);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createProject = createProject;
const getProjectById = async (req, res) => {
    try {
        const project = await Project_1.default.findById(req.params.id).populate('members', 'name email');
        if (project) {
            res.json(project);
        }
        else {
            res.status(404).json({ message: 'Project not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admins can update projects' });
    }
    const { name, description, members } = req.body;
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (project) {
            project.name = name || project.name;
            project.description = description || project.description;
            if (members)
                project.members = members;
            const updatedProject = await project.save();
            res.json(updatedProject);
        }
        else {
            res.status(404).json({ message: 'Project not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Only admins can delete projects' });
    }
    try {
        const project = await Project_1.default.findById(req.params.id);
        if (project) {
            await project.deleteOne();
            res.json({ message: 'Project removed' });
        }
        else {
            res.status(404).json({ message: 'Project not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteProject = deleteProject;
