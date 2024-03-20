import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getSingleUser,
    getAllUsers,
    userProfile,
} from '../controllers/user.controllers.js';
import {
    adminCheck,
    tokenValidator,
} from '../middlewares/validation.middlewares.js';

const router = Router();

router.post('/register', registerUser); // Route to register a new user
router.post('/login', loginUser); // Route to register a new user
router.get('/', tokenValidator, adminCheck, getAllUsers); // Route to get all users
router.get('/profile', tokenValidator, userProfile);
router.get('/:id', getSingleUser);

export default router;
