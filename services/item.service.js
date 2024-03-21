import Item from '../models/Item.Model.js';

export const fieldsToReturn = 'title seller location condition price';

// Function to find an item by its ID
export const findItemById = async (itemId) => {
    return await Item.findById(itemId).select(fieldsToReturn);
};
