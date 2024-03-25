import { Router } from 'express';
import {
    createSeller,
    getAllSellers,
    getSingleSeller,
    loginSeller,
    logoutSeller,
    getCurrentUser,
    updateCurrentUser,
    getApplicationStats,
} from '../controllers/sellers.controller.js';
import {
    validateObjectId,
    validateNewUserInputs,
    validateUserLogin,
    authenticateUser,
    authorizePermissions,
    // validateUpdateUserInputs,
} from '../middlewares/validation.middleware.js';

const router = Router();

// Route for registering a new seller
router.post('/register', validateNewUserInputs, createSeller);

// Route for logging in a seller
router.post('/login', validateUserLogin, loginSeller);

// Route for logging out a seller
router.get('/logout', logoutSeller);

// Route for getting all sellers (requires authentication)
router.route('/').get(authenticateUser, getAllSellers);

// Route for getting a single seller by ID
router.route('/:id').all(validateObjectId).get(getSingleSeller);

// Route for getting the profile of the currently authenticated seller and updating it
router
    .route('/self/profile')
    .get(authenticateUser, getCurrentUser)
    .put(authenticateUser, updateCurrentUser);

// Route for getting application statistics (requires admin permission)
router.get(
    '/admin/stats',
    authenticateUser,
    authorizePermissions('admin'),
    getApplicationStats
);

export default router;
