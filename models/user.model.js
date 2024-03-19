import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true, // Ensure usernames are unique
            trim: true, // Trim whitespace from usernames
            index: true, // Add index on username field
        },
        email: {
            type: String,
            unique: true, // Ensure emails are unique
            lowercase: true, // Convert emails to lowercase
            trim: true, // Trim whitespace from emails
            index: true, // Add index on email field
            validate: {
                validator: function (value) {
                    // Custom email validation using regex
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: (props) =>
                    `${props.value} is not a valid email address!`,
            },
            required: [true, 'Email is required'], // Custom error message for required field
        },
        password: {
            type: String,
            trim: true,
            required: [true, 'Password is required'], // Custom error message for required field
            minlength: [8, 'Password must be at least 8 characters long'], // Custom error message for minlength validation
            validate: {
                validator: function (value) {
                    // Check if password contains any whitespace characters
                    return !/\s/.test(value);
                },
                message: 'Password cannot contain spaces',
            },
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'], // Custom error message for required field
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'], // Custom error message for required field
        },
        phoneNumber: String,
        profilePicture: String,
        accountStatus: {
            type: String,
            enum: ['active', 'inactive', 'banned'],
            default: 'active',
        },
        accountRole: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function (next) {
    // Check if the password field has been modified
    if (!this.isModified('password')) {
        return next(); // Skip hashing if password hasn't been modified
    }

    try {
        // Hash the password using bcrypt with a salt factor of 10
        const hashedPassword = await bcrypt.hash(this.password, 10);
        // Set the hashed password back to the password field
        this.password = hashedPassword;

        // Check if there are any existing users in the database
        const existingUsersCount = await this.constructor.countDocuments();
        // Set the default role based on the number of existing users
        this.accountRole = existingUsersCount === 0 ? 'admin' : 'user';

        next(); // Proceed to save the document
    } catch (error) {
        // Pass any error to the next middleware or error handler
        return next(error);
    }
});

const User = mongoose.model('User', userSchema);

export default User;
