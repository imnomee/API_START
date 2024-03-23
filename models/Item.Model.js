import mongoose from 'mongoose';
import {
    ITEM_CONDITION,
    LISTING_DAYS,
    PAYMENT_OPTIONS,
} from '../utils/constants.js';

const { Schema, model } = mongoose;

// Schema for shipping options with method and cost
const shippingOptionSchema = new Schema(
    {
        method: { type: String, required: true, maxlength: 50 }, // Shipping method with max length of 50 characters
        cost: { type: Number, required: true, min: 0 }, // Shipping cost, must be non-negative
    },
    { _id: false } // Disable _id generation for subdocument
);

// Main product schema
const productSchema = new Schema(
    {
        // Basic product details
        title: { type: String, required: true }, // Title of the product, required
        description: { type: String, required: true }, // Description of the product, required
        price: { type: Number, required: true, min: 0 }, // Price of the product, must be non-negative
        category: { type: String, required: true }, // Category of the product, required
        condition: {
            type: String,
            enum: Object.values(ITEM_CONDITION),
            default: ITEM_CONDITION.USED,
        }, // Condition of the product with predefined options
        seller: { type: Schema.Types.ObjectId, ref: 'Seller' }, // Reference to the seller of the product
        location: { type: String, required: true }, // Location of the product, required
        shippingOptions: [shippingOptionSchema], // Array of shipping options using the shippingOptionSchema
        images: { type: [String], default: [] }, // Array of image URLs, default empty array
        quantity: { type: Number, required: true, min: 0 }, // Quantity available, must be non-negative
        availability: { type: Boolean, default: true }, // Availability status of the product, defaults to true
        attributes: {
            // Attributes for the product
            brand: { type: String, required: true }, // Brand of the product, required
            color: { type: String, required: true }, // Color of the product, required
        },
        listingDuration: {
            type: String,
            enum: Object.values(LISTING_DAYS),
            default: LISTING_DAYS.WEEK,
        },
        sku: { type: String, required: true }, // Stock Keeping Unit identifier, required
        endDate: { type: Date, required: true }, // End date of the product listing, required
        paymentOptions: {
            type: [String],
            enum: Object.values(PAYMENT_OPTIONS),
            default: PAYMENT_OPTIONS.BANK,
            required: true,
        }, // Payment options with predefined values, required
        returnPolicy: {
            type: String,
            required: true,
            default: 'No returns accepted',
        }, // Return policy of the product, required with default value
        sellerNotes: String, // Additional notes from the seller, optional
    },
    { timestamps: true, versionKey: false } // Enable timestamps to track creation and update, disable version key
);

// Export the model to use it in other parts of the application
const Product = model('Product', productSchema);
export default Product;
