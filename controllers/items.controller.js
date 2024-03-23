import { NotFoundError } from '../errors/custom.errors.js';
import Item from '../models/Item.Model.js';
import { FIELDS } from '../utils/constants.js';
import { StatusCodes } from 'http-status-codes';

// Get all items from the database
export const getAllItems = async (req, res) => {
    const items = await Item.find().select(FIELDS);
    res.status(StatusCodes.OK).json({ total: items.length, items });
};

// Get a single item by ID
export const getSingleItem = async (req, res) => {
    const item = await Item.findById(req.params.id).select(FIELDS);
    if (!item) throw new NotFoundError(`No item with id: ${req.params.id}`);
    return res.status(StatusCodes.OK).json({ msg: 'Item found', item });
};

// Update a single item by ID
export const updateSingleItem = async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    }).select(FIELDS);
    if (!item) throw new NotFoundError(`No item with id: ${req.params.id}`);
    res.status(StatusCodes.OK).json({ msg: 'Item updated', item });
};

// Delete a single item by ID
export const deleteSingleItem = async (req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) throw new NotFoundError(`No item with id: ${req.params.id}`);
    res.status(StatusCodes.OK).json({ msg: 'Item deleted', item });
};

// Create a new item
export const createItem = async (req, res) => {
    const item = await Item.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: 'Item created', item });
};
