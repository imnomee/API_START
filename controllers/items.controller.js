import { NotFoundError, UnauthorizedError } from '../errors/custom.errors.js';
import Item from '../models/Item.Model.js';
import { ITEM_FIELDS } from '../utils/constants.js';
import { StatusCodes } from 'http-status-codes';

// Get all items from the database
export const getAllItems = async (req, res) => {
    const items = await Item.find().select(ITEM_FIELDS);
    res.status(StatusCodes.OK).json({ total: items.length, items });
};

// Get a single item by ID
export const getSingleItem = async (req, res) => {
    const item = await Item.findById(req.params.id).select(ITEM_FIELDS);
    if (!item) throw new NotFoundError(`No item with id: ${req.params.id}`);
    return res.status(StatusCodes.OK).json({ msg: 'Item found', item });
};

// Update a single item by ID
export const updateSingleItem = async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) throw new NotFoundError(`No item with id: ${req.params.id}`);

    // Check if the user is an admin or the owner of the item
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user.userId === item.seller.toString();

    if (!isAdmin && !isOwner) {
        // If user is not authorized to delete the item, throw UnauthorizedError
        throw new UnauthorizedError('You cannot edit this item.');
    }

    await item.updateOne(req.body);

    res.status(StatusCodes.OK).json({ msg: 'Item updated', item });
};

// Delete a single item by ID
export const deleteSingleItem = async (req, res) => {
    // Extract user data from request
    const { userId, role } = req.user;

    // Find the item by ID
    const item = await Item.findById(req.params.id);

    // Check if item exists
    if (!item) {
        // If item doesn't exist, throw NotFoundError
        throw new NotFoundError(`No item with id: ${req.params.id}`);
    }

    // Check if the user is an admin or the owner of the item
    const isAdmin = role === 'admin';
    const isOwner = userId === item.seller.toString();

    if (!isAdmin && !isOwner) {
        // If user is not authorized to delete the item, throw UnauthorizedError
        throw new UnauthorizedError('Not authorized to access this route');
    }

    // Delete the item
    await item.deleteOne();

    // Return success response
    res.status(StatusCodes.OK).json({ msg: 'Item deleted', item });
};

// Create a new item
export const createItem = async (req, res) => {
    req.body.seller = req.user.userId;
    const item = await Item.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: 'Item created', item });
};

export const getCurrentUserItems = async (req, res) => {
    const seller = req.user.userId;
    const items = await Item.find({ seller }).select(ITEM_FIELDS);
    return res.status(StatusCodes.OK).json({ total: items.length, items });
};
