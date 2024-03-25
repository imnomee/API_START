import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ACCOUNT_ROLES } from '../utils/constants.js';

// Define the Seller schema
const sellerSchema = new mongoose.Schema(
    {
        // Username of the seller, must be unique
        username: { type: String, required: true, unique: true, trim: true },

        // Seller rating, ranging from 0 to 5
        sellerRating: { type: Number, min: 0, max: 5 },

        // Email address of the seller
        email: { type: String, required: true, unique: true },

        // Password of the seller's account
        password: { type: String, required: true },

        // First name of the seller
        firstName: { type: String, required: true },

        // Last name of the seller
        lastName: { type: String, required: true },

        // Phone number of the seller
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            default: '000000000',
        },

        // URL to the seller's profile picture
        profilePicture: { type: String },

        // Date of the seller's last login
        lastLoginDate: { type: Date, default: new Date(Date.now()) },

        // Account Role
        accountRole: {
            type: String,
            enum: Object.values(ACCOUNT_ROLES),
            default: ACCOUNT_ROLES.USER,
        },
    },
    {
        // Enable timestamps to track creation and update
        timestamps: true,

        // Disable version key
        versionKey: false,
    }
);

// Pre-save hook to hash the password before saving the seller
sellerSchema.pre('save', async function (next) {
    try {
        // Hash the password if it's modified or new
        if (this.isModified('password') || this.isNew) {
            const hashedPassword = await bcrypt.hash(this.password, 10); // 10 is the saltRounds
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Export the model to use it in other parts of the application
const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;
