import { Router } from 'express';
import {
    createItem,
    deleteSingleItem,
    getAllItems,
    getSingleItem,
    updateSingleItem,
    getCurrentUserItems,
} from '../controllers/items.controller.js';
import {
    validateItemInputs,
    authenticateUser,
    validateObjectId,
} from '../middlewares/validation.middleware.js';
const router = Router();

router
    .route('/')
    .post(authenticateUser, validateItemInputs, createItem)
    .get(getAllItems);
router.get('/current', authenticateUser, getCurrentUserItems);
router
    .route('/:id')
    .all(validateObjectId, authenticateUser)
    .put(validateItemInputs, updateSingleItem)
    .get(getSingleItem)
    .delete(deleteSingleItem);

export default router;
