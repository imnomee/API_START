import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getAllUsers,
} from '../controllers/user.controllers.js';
import { userValidator } from '../middlewares/validation.middlewares.js';

const router = Router();

router.post('/register', registerUser); // Route to register a new user
router.post('/login', loginUser); // Route to register a new user
router.get('/', userValidator, getAllUsers); // Route to get all users

export default router;
