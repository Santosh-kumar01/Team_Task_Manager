import express from 'express';
const router = express.Router();
import {  getTasks, createTask, updateTask, deleteTask  } from '../controllers/taskCtrl';
import {  protect  } from '../middleware/auth';

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
