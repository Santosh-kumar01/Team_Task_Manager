import Project from '../models/Project';
import Task from '../models/Task';

export const getProjects = async (req: any, res: any) => {
  try {
    const projects = await Project.find({ $or: [{ members: req.user._id }, { createdBy: req.user._id }] }).populate('members', 'name email').lean();
    
    const projectsWithProgress = await Promise.all(projects.map(async (project) => {
      const totalTasks = await Task.countDocuments({ project: project._id });
      const doneTasks = await Task.countDocuments({ project: project._id, status: { $in: ['Done', 'done'] } });
      return { ...project, totalTasks, doneTasks };
    }));
    
    res.json(projectsWithProgress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req: any, res: any) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admins can create projects' });
  }
  const { name, description, members } = req.body;
  try {
    const project = await Project.create({
      name,
      description,
      members,
      createdBy: req.user._id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: any, res: any) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name email');
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: any, res: any) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admins can update projects' });
  }
  const { name, description, members } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      project.name = name || project.name;
      project.description = description || project.description;
      if (members) project.members = members;
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req: any, res: any) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admins can delete projects' });
  }
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
