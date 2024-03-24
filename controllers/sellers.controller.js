import Seller from '../models/Seller.Model.js'; // Import Seller model
import { StatusCodes } from 'http-status-codes'; // Import HTTP status codes
import jwt from 'jsonwebtoken'; // Import JWT for token generation
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import { USER_FIELDS } from '../utils/constants.js'; // Import constants
import { NotFoundError, UnauthorizedError } from '../errors/custom.errors.js'; // Import custom error classes

// Function to determine the account role based on whether it's the first account or not
const determineAccountRole = async () => {
    // Check if the seller count is zero
    const isFirstAccount = (await Seller.countDocuments()) === 0;
    // Return 'admin' if it's the first account, else return 'user'
    return isFirstAccount ? 'admin' : 'user';
};

// Create a new seller
export const createSeller = async (req, res) => {
    // Determine the account role
    const accountRole = await determineAccountRole();

    // Create the seller
    const seller = await Seller.create(req.body);

    // Extract relevant ITEM_FIELDS for response
    const { username, email, firstName } = seller;

    // Return success response with selected ITEM_FIELDS
    return res.status(StatusCodes.CREATED).json({
        msg: 'Seller created',
        seller: { username, email, accountRole, firstName },
    });
};

// Login seller
export const loginSeller = async (req, res) => {
    // Find seller by email
    const seller = await Seller.findOne({ email: req.body.email });

    // If seller not found, throw a NotFoundError
    if (!seller) {
        throw new NotFoundError('User not found');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(req.body.password, seller.password);

    // If passwords don't match, throw an UnauthorizedError
    if (!isMatch) {
        throw new UnauthorizedError('Invalid User');
    }

    // If credentials are correct, generate JWT token with seller id and accountRole
    const token = jwt.sign(
        { userId: seller._id, role: seller.accountRole },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const { _id, username, email, firstName } = seller;
    // Set cookie with the JWT token
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000, // Token expires in 1 day
        secure: process.env.NODE_ENV === 'production',
    });

    // Return success response
    return res.status(StatusCodes.OK).json({
        msg: 'User found',
        seller: { _id, username, email, firstName },
    });
};

// Logout seller
export const logoutSeller = async (req, res) => {
    // Clear the token by setting its expiration date to a date in the past
    res.clearCookie('token');

    // Return success response
    return res
        .status(StatusCodes.OK)
        .json({ msg: 'User logged out successfully' });
};

// Get all sellers
export const getAllSellers = async (req, res) => {
    // Retrieve all sellers
    const sellers = await Seller.find().select(USER_FIELDS);

    // Return success response
    return res.status(StatusCodes.OK).json({ msg: 'Sellers found', sellers });
};

// Get a single seller by ID
export const getSingleSeller = async (req, res) => {
    // Find seller by ID
    const seller = await Seller.findById(req.params.id).select(USER_FIELDS);

    // If seller not found, throw a NotFoundError
    if (!seller) {
        throw new NotFoundError(`No seller with id: ${req.params.id}`);
    }

    // Return success response
    return res.status(StatusCodes.OK).json({ msg: 'Seller found', seller });
};

// Route to get current user details
export const getCurrentUser = async (req, res) => {
    const seller = await Seller.findOne({ _id: req.user.userId }).select(
        USER_FIELDS
    );
    // If seller not found, throw a NotFoundError
    if (!seller) {
        throw new NotFoundError('User not found');
    }
    return res.status(StatusCodes.OK).json({ msg: 'user found', seller });
};

// Route to get application statistics (for admin)
export const getApplicationStats = async (req, res) => {
    return res.status(StatusCodes.OK).json('get application stats');
};

// Route to update current user details
export const updateCurrentUser = async (req, res) => {
    // Extract fields from request body that need to be updated
    const { username, email, password, firstName, lastName, phoneNumber } =
        req.body;

    // Find the seller by ID
    const seller = await Seller.findById(req.user.userId);

    // If seller not found, throw a NotFoundError
    if (!seller) {
        throw new NotFoundError('User not found');
    }

    // Create an object to store updated fields
    const updatedFields = {};
    // Create an object to store updated fields
    if (username && username !== seller.username)
        updatedFields.username = username;
    if (email && email !== seller.email) updatedFields.email = email;
    if (password && password !== seller.password)
        updatedFields.password = password;
    if (firstName && firstName !== seller.firstName)
        updatedFields.firstName = firstName;
    if (lastName && lastName !== seller.lastName)
        updatedFields.lastName = lastName;
    if (phoneNumber && phoneNumber !== seller.phoneNumber)
        updatedFields.phoneNumber = phoneNumber;

    // If no fields are updated, return a different message with seller info
    if (Object.keys(updatedFields).length === 0) {
        return res
            .status(StatusCodes.OK)
            .json({ msg: 'No changes found', seller });
    }

    // Update the seller with only the provided and changed fields
    const updatedSeller = await Seller.findByIdAndUpdate(
        req.user.userId,
        updatedFields,
        { new: true }
    );

    // Return success response with the updated seller details
    return res
        .status(StatusCodes.OK)
        .json({ msg: 'User updated', seller: updatedSeller });
};
