import { Router } from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getSingleUser,
    getAllUsers,
    currentUser,
} from '../controllers/user.controllers.js';
import {
    adminCheck,
    tokenValidator,
} from '../middlewares/validation.middlewares.js';

const router = Router();

router.post('/register', registerUser); // Route to register a new user
router.get('/logout', logoutUser); // Route to logout a user
router.post('/login', loginUser); // Route to register a new user
router.get('/profile', tokenValidator, currentUser);
router.get('/', tokenValidator, adminCheck, getAllUsers); // Route to get all users
router.get('/:id', getSingleUser);

export default router;
