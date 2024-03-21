import mongoose from 'mongoose';

// Destructure the Schema object from mongoose
const { Schema } = mongoose;

// Define the schema for the item
const itemSchema = new Schema(
    {
        // Title of the item
        title: {
            type: String,
            required: true,
            minlength: 10, // Minimum length of 10 characters
            maxlength: 100, // Maximum length of 100 characters
            trim: true,
        },
        // Description of the item
        description: {
            type: String,
            required: true,
            minlength: 50, // Minimum length of 50 characters
            maxlength: 500, // Maximum length of 500 characters
            trim: true,
        },
        // Price of the item
        price: {
            type: Number,
            required: true,
            min: 0, // Minimum value of 0
            default: 0, // Default value of 0
        },
        // Category of the item
        category: {
            type: String,
            required: true,
        },
        // Condition of the item
        condition: {
            type: String,
            enum: ['new', 'used', 'refurb'],
            default: 'new', // Default value of 'New'
        },
        // Seller information
        seller: {
            username: { type: String, required: true },
            sellerRating: { type: Number, required: true },
        },
        // Location of the item
        location: {
            city: { type: String, default: 'My City' }, // Default value of 'My City'
            country: { type: String, required: true },
        },
        // Shipping options for the item
        shippingOptions: [
            {
                method: { type: String, required: true },
                cost: { type: Number, required: true },
            },
        ],
        // Images of the item
        images: [{ type: String, required: true }],
        // Quantity of the item
        quantity: {
            type: Number,
            min: 0, // Minimum value of 0
            default: 1, // Default value of 1
        },
        // Availability of the item
        availability: {
            type: Boolean,
            default: true, // Default value of true
        },
        // Additional attributes of the item
        attributes: {
            type: Schema.Types.Mixed,
        },
        // Stock Keeping Unit (SKU) of the item
        sku: {
            type: String,
            required: true,
        },
        // Accepted payment options for the item
        paymentOptions: [
            {
                type: String,
                required: true,
            },
        ],
        // Return policy for the item
        returnPolicy: {
            type: String,
            required: true,
        },
        // Notes provided by the seller
        sellerNotes: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Create the Mongoose model for the item
const Item = mongoose.model('Item', itemSchema);

export default Item;
