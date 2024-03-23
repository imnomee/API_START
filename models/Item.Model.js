import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Schema for shipping options with method and cost
const shippingOptionSchema = new Schema(
    {
        method: { type: String, required: true },
        cost: { type: Number, required: true, min: 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Main product schema
const productSchema = new Schema(
    {
        // Basic product details
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },

        // Product condition with predefined options
        condition: {
            type: String,
            enum: ['used', 'new', 'refurbished'],
            default: 'used',
        },

        // Embedded seller schema
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'Seller',
        },

        // Location as a simple string representing the city
        location: { type: String, required: true },

        // Array of shipping options using the shippingOptionSchema
        shippingOptions: [shippingOptionSchema],

        // Array of image URLs with validation to ensure they are URLs
        images: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v.every((url) => /^(https?:\/\/).+/.test(url));
                },
                message: (props) => `${props.value} is not a valid URL!`,
            },
        },

        // Quantity available, must be zero or more
        quantity: { type: Number, required: true, min: 0 },

        // Availability as a boolean, defaults to true
        availability: { type: Boolean, default: true },

        // Attributes for the product, with some fields required
        attributes: {
            brand: { type: String, required: true },
            color: { type: String, required: true },
            storageCapacity: { type: String, required: true },
            screenSize: { type: String },
            resolution: { type: String },
        },

        // Stock Keeping Unit identifier, required
        sku: { type: String, required: true },

        // Listing and end dates for the product availability
        listingDate: { type: Date, required: true },
        endDate: { type: Date, required: true },

        // Payment options with predefined values
        paymentOptions: {
            type: [String],
            enum: ['Credit Card', 'PayPal'],
            required: true,
        },

        // Return policy as a string, required
        returnPolicy: { type: String, required: true },

        // Additional notes from the seller, optional
        sellerNotes: String,
    },
    {
        // Enable timestamps to track creation and update, disable version key
        timestamps: true,
        versionKey: false,
    }
);

// Export the model to use it in other parts of the application
const Product = model('Product', productSchema);
export default Product;
