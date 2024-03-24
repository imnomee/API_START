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
    // validateUpdateUserInputs,
} from '../middlewares/validation.middleware.js';

const router = Router();

router.post('/register', validateNewUserInputs, createSeller);
router.post('/login', validateUserLogin, loginSeller);
router.get('/logout', logoutSeller);
router.route('/').get(authenticateUser, getAllSellers);
router.route('/:id').all(validateObjectId).get(getSingleSeller);
router
    .route('/self/profile')
    .get(authenticateUser, getCurrentUser)
    .put(authenticateUser, updateCurrentUser);
router.get('/admin/stats', authenticateUser, getApplicationStats);

export default router;
