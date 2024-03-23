import Item from '../models/Item.Model.js';

// Fields to return for each item
const fieldsToReturn = 'title description price quantity condition';

// Get all items from the database
export const getAllItems = async (req, res) => {
    const items = await Item.find().select(fieldsToReturn);
    res.status(200).json({ total: items.length, items });
};

// Get a single item by ID
export const getSingleItem = async (req, res) => {
    const item = await Item.findById(req.params.id).select(fieldsToReturn);
    if (!item) {
        res.status(404).json({ msg: 'Item not found' });
    } else {
        res.status(200).json({ msg: 'Item found', item });
    }
};

// Update a single item by ID
export const updateSingleItem = async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!item) {
        res.status(404).json({ msg: 'Item not found' });
    } else {
        res.status(200).json({ msg: 'Item updated', item });
    }
};

// Delete a single item by ID
export const deleteSingleItem = async (req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
        res.status(404).json({ msg: 'Item not found' });
    } else {
        res.status(200).json({ msg: 'Item deleted', item });
    }
};

// Create a new item
export const createItem = async (req, res) => {
    const item = await Item.create(req.body);
    res.status(200).json({ msg: 'Item created', item });
};
