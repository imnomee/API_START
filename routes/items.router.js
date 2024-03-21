import { Router } from 'express';
import {
    createItem,
    deleteItemById,
    getAllItems,
    getItemById,
    updateItemById,
} from '../controllers/items.controller.js';
const router = Router();

router.route('/').post(createItem).get(getAllItems);
router
    .route('/:id')
    .get(getItemById)
    .delete(deleteItemById)
    .put(updateItemById);

export default router;
