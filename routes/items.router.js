import { Router } from 'express';
import {
    createItem,
    deleteSingleItem,
    getAllItems,
    getSingleItem,
    updateSingleItem,
} from '../controllers/items.controller.js';
import { validateObjectId } from '../middlewares/validation.middleware.js';
import { validateItemInputs } from '../middlewares/validation.middleware.js';
const router = Router();

router.route('/').post(validateItemInputs, createItem).get(getAllItems);
router
    .route('/:id')
    .all(validateObjectId)
    .put(validateItemInputs, updateSingleItem)
    .get(getSingleItem)
    .delete(deleteSingleItem);

export default router;
