import Item from '../models/Item.Model.js'; // Importing the Item model
import { StatusCodes } from 'http-status-codes'; // Importing HTTP status codes
import { validationResult } from 'express-validator'; // Importing validation result from express-validator
import { findItemById, fieldsToReturn } from '../services/item.service.js'; // Importing utility functions from item service

// Controller method to get all items
export const getAllItems = async (req, res) => {
    const items = await Item.find({}).select(fieldsToReturn); // Retrieving all items and selecting specific fields
    return res.status(StatusCodes.OK).json({ data: items }); // Returning items in a consistent response format
};

// Controller method to get an item by ID
export const getItemById = async (req, res) => {
    const item = await findItemById(req.params.id); // Finding item by ID
    if (!item) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: `No item found with ID: ${req.params.id}` }); // Handling not found case
    }
    return res.status(StatusCodes.OK).json({ data: item }); // Returning item in a consistent response format
};

// Controller method to delete an item by ID
export const deleteItemById = async (req, res) => {
    const item = await findItemById(req.params.id); // Finding item by ID
    if (!item) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: `No item found with ID: ${req.params.id}` }); // Handling not found case
    }
    await item.remove(); // Removing the item
    return res
        .status(StatusCodes.OK)
        .json({ data: item, message: 'Item removed' }); // Returning success message
};

// Controller method to update an item by ID
export const updateItemById = async (req, res) => {
    const errors = validationResult(req); // Validating request body
    if (!errors.isEmpty()) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() }); // Handling validation errors
    }
    const item = await findItemById(req.params.id); // Finding item by ID
    if (!item) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: `No item found with ID: ${req.params.id}` }); // Handling not found case
    }
    Object.assign(item, req.body); // Updating the item with request body
    await item.save(); // Saving the updated item
    return res
        .status(StatusCodes.OK)
        .json({ data: item, message: 'Item updated' }); // Returning success message
};

// Controller method to create a new item
export const createItem = async (req, res) => {
    const errors = validationResult(req); // Validating request body
    if (!errors.isEmpty()) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ errors: errors.array() }); // Handling validation errors
    }
    const item = new Item(req.body); // Creating a new item instance
    await item.save(); // Saving the new item
    return res
        .status(StatusCodes.CREATED)
        .json({ data: item, message: 'Item created' }); // Returning success message
};
