import { Router } from 'express';
import {
    createSeller,
    getAllSellers,
    getSingleSeller,
} from '../controllers/sellers.controller.js';
import { validateObjectId } from '../middlewares/validation.middleware.js';
import { getSingleItem } from '../controllers/items.controller.js';
const router = Router();

router.route('/').post(createSeller).get(getAllSellers);
router.route('/:id').all(validateObjectId).get(getSingleSeller);

export default router;
