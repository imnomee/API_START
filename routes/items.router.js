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

// Route for creating a new item and getting all items
router
    .route('/')
    .post(authenticateUser, validateItemInputs, createItem)
    .get(getAllItems);

// Route for getting items created by the current user
router.get('/current', authenticateUser, getCurrentUserItems);

// Route for getting, updating, and deleting a single item by ID
router
    .route('/:id')
    .all(validateObjectId, authenticateUser)
    .put(validateItemInputs, updateSingleItem) // Update item
    .get(getSingleItem) // Get single item
    .delete(deleteSingleItem); // Delete single item

export default router;
