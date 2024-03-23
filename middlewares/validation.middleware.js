import mongoose from 'mongoose';
import { BadRequestError } from '../errors/custom.errors.js';
import { body, validationResult } from 'express-validator';
import {
    ITEM_CONDITION,
    LISTING_DAYS,
    PAYMENT_OPTIONS,
} from '../utils/constants.js';

// Middleware to validate ObjectId
export const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid ID format' });
    }
    next();
};

// Middleware function to handle validation errors
const withValidationErrors = (rules) => {
    return [
        rules,
        (req, res, next) => {
            // Validate the request body against the provided rules
            const errors = validationResult(req);

            // If there are validation errors
            if (!errors.isEmpty()) {
                // Extract error messages from validation result
                const errorMessages = errors.array().map((err) => err.msg);
                // Pass the error messages to the error handling middleware
                next(new BadRequestError(errorMessages));
            } else {
                // If there are no validation errors, proceed to the next middleware
                next();
            }
        },
    ];
};

export const validateItemInputs = withValidationErrors([
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('condition')
        .trim()
        .notEmpty()
        .isIn(Object.values(ITEM_CONDITION))
        .withMessage('Invalid condition'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('quantity')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),
    body('attributes.brand').trim().notEmpty().withMessage('Brand is required'),
    body('attributes.color').trim().notEmpty().withMessage('Color is required'),
    body('listingDuration')
        .trim()
        .notEmpty()
        .isIn(Object.values(LISTING_DAYS))
        .withMessage('Invalid listing duration'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('endDate')
        .isISO8601()
        .toDate()
        .withMessage('End date must be a valid date'),
    body('paymentOptions')
        .isArray({ min: 1 })
        .withMessage('Payment options are required'),
    body('returnPolicy')
        .trim()
        .notEmpty()
        .withMessage('Return policy is required'),
    body('sellerNotes').optional().trim(),
    // Validate shipping options array
    body('shippingOptions')
        .isArray()
        .withMessage('Shipping options must be an array')
        .bail()
        .custom((options) => {
            options.forEach((option, index) => {
                const { method, cost } = option;
                if (!method || !cost) {
                    throw new Error(
                        `Shipping option at index ${index} is invalid`
                    );
                }
            });
            return true;
        })
        .bail()
        .custom((options) => {
            const invalidOptions = options.filter(
                (option) => option.cost < 0 || option.method.length > 50
            );
            if (invalidOptions.length > 0) {
                throw new Error(
                    `Invalid shipping options: ${invalidOptions
                        .map(
                            (o, index) =>
                                `index ${index}: ${o.method}, ${o.cost}`
                        )
                        .join('; ')}`
                );
            }
            return true;
        }),
]);
