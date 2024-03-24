import Seller from '../models/Seller.Model.js';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { USER_FIELDS } from '../utils/constants.js';
import { NotFoundError, UnauthorizedError } from '../errors/custom.errors.js';

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
    return res
        .status(StatusCodes.OK)
        .json({
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
