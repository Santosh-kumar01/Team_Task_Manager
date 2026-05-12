import express from 'express';
const router = express.Router();
import {  registerUser, loginUser, logoutUser, getMe, getAllUsers  } from '../controllers/authCtrl';
import {  protect  } from '../middleware/auth';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.get('/users', protect, getAllUsers);

export default router;
