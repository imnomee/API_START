import { Router } from 'express';
import {
    createSeller,
    getAllSellers,
    getSingleSeller,
    loginSeller,
} from '../controllers/sellers.controller.js';
import {
    validateObjectId,
    validateNewUserInputs,
    validateUserLogin,
} from '../middlewares/validation.middleware.js';

const router = Router();

router.post('/register', validateNewUserInputs, createSeller);
router.post('/login', validateUserLogin, loginSeller);
router.route('/').get(getAllSellers);
router.route('/:id').all(validateObjectId).get(getSingleSeller);

export default router;
