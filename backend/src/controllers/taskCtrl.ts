import Task from '../models/Task';
import Project from '../models/Project';

export const getTasks = async (req: any, res: any) => {
  try {
    let query: any = {};
    if (req.query.projectId) {
      query.project = req.query.projectId;
    }
    // If not admin, only see assigned tasks
    if (req.user.role !== 'Admin') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name email').populate('project', 'name');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: any, res: any) => {
  const { title, description, status, dueDate, project, assignedTo } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      project,
      assignedTo,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: any, res: any) => {
  const { status, assignedTo, dueDate, title, description } = req.body;
  try {
    const task = await Task.findById(req.params.id);
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
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: any, res: any) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Only admins can delete tasks' });
  }
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
