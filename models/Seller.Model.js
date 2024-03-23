import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the Seller schema
const sellerSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        sellerRating: { type: Number, min: 0, max: 5 },
        // Add other seller details here
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Create a Seller model
const Seller = model('Seller', sellerSchema);
export default Seller;
