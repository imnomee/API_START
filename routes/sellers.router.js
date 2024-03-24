import { Router } from 'express';
import {
    createSeller,
    getAllSellers,
    getSingleSeller,
    loginSeller,
    logoutSeller,
} from '../controllers/sellers.controller.js';
import {
    validateObjectId,
    validateNewUserInputs,
    validateUserLogin,
    authenticateUser,
} from '../middlewares/validation.middleware.js';

const router = Router();

router.post('/register', validateNewUserInputs, createSeller);
router.post('/login', validateUserLogin, loginSeller);
router.get('/logout', logoutSeller);
router.route('/').get(authenticateUser, getAllSellers);
router.route('/:id').all(validateObjectId).get(getSingleSeller);

export default router;
