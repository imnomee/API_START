import { body } from 'express-validator';

// Validation rules for the Item model
export const itemValidationRules = () => {
    return [
        // Title validation rules
        body('title')
            .notEmpty()
            .withMessage('Title is required')
            .isLength({ min: 10, max: 100 })
            .withMessage('Title must be between 10 and 100 characters'),

        // Description validation rules
        body('description')
            .notEmpty()
            .withMessage('Description is required')
            .isLength({ min: 50, max: 500 })
            .withMessage('Description must be between 50 and 500 characters'),

        // Price validation rules
        body('price')
            .notEmpty()
            .withMessage('Price is required')
            .isFloat({ min: 0 })
            .withMessage('Price must be a positive number'),

        // Category validation rules
        body('category').notEmpty().withMessage('Category is required'),

        // Condition validation rules
        body('condition').notEmpty().withMessage('Condition is required'),

        // Seller validation rules
        body('seller.username')
            .notEmpty()
            .withMessage('Seller username is required'),

        body('seller.sellerRating')
            .notEmpty()
            .withMessage('Seller rating is required')
            .isInt({ min: 1 })
            .withMessage('Seller rating must be a non-negative integer'),

        // Location validation rules
        body('location.city').notEmpty().withMessage('City is required'),

        body('location.country').notEmpty().withMessage('Country is required'),

        // Shipping Options validation rules
        body('shippingOptions.*.method')
            .notEmpty()
            .withMessage('Shipping method is required'),

        body('shippingOptions.*.cost')
            .notEmpty()
            .withMessage('Shipping cost is required')
            .isFloat({ min: 0 })
            .withMessage('Shipping cost must be a positive number'),

        // Images validation rules
        body('images')
            .isArray({ min: 1 })
            .withMessage('At least one image is required'),

        // Quantity validation rules
        body('quantity')
            .notEmpty()
            .withMessage('Quantity is required')
            .isInt({ min: 0 })
            .withMessage('Quantity must be a non-negative integer'),

        // Availability validation rules
        body('availability')
            .notEmpty()
            .withMessage('Availability is required')
            .isBoolean()
            .withMessage('Availability must be a boolean'),

        // SKU validation rules
        body('sku').notEmpty().withMessage('SKU is required'),
        // Payment Options validation rules
        body('paymentOptions')
            .notEmpty()
            .withMessage('Payment options are required')
            .isArray({ min: 1 })
            .withMessage('At least one payment option is required'),

        // Return Policy validation rules
        body('returnPolicy')
            .notEmpty()
            .withMessage('Return policy is required'),

        // Seller Notes validation rules
        body('sellerNotes').notEmpty().withMessage('Seller notes are required'),
    ];
};
