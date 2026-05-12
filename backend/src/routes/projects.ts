import express from 'express';
const router = express.Router();
import {  getProjects, createProject, getProjectById, updateProject, deleteProject  } from '../controllers/projectCtrl';
import {  protect  } from '../middleware/auth';

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
