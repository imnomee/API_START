import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { COOKIEOPTIONS } from '../utils/constants.js';
import { createToken } from '../utils/token.handler.js';

const fieldsToReturn =
    'username email firstName lastName createdAt accountRole accountStatus';

// Controller to register a new user
export const registerUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        return res.status(201).json({ message: 'User created', user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Controller to authenticate user login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ error: 'User not found with that email' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = createToken({ userId: user._id, role: user.accountRole });
        res.cookie('token', token, COOKIEOPTIONS);
        return res.status(200).json({ msg: 'User logged in successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to fetch the current user's profile
export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            fieldsToReturn
        );
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to fetch details of a single user
export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(fieldsToReturn);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to fetch details of all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select(fieldsToReturn);
        return res.status(200).json({ total: users.length, users });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const logoutUser = async (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    // Redirect to a page or respond with a success message
    return res.status(200).json({ message: 'User logged out successfully' });
};
