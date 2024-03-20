import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { COOKIEOPTIONS } from '../utils/constants.js';
import { createToken } from '../utils/token.handler.js';
import asyncHandler from 'express-async-handler';

const fieldsToReturn =
    'username email firstName lastName createdAt accountRole accountStatus';

// Controller to register a new user
export const registerUser = asyncHandler(async (req, res) => {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json({ message: 'User created', user });
});

// Controller to authenticate user login
export const loginUser = asyncHandler(async (req, res) => {
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
});

// Controller to fetch the current user's profile
export const userProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId).select(fieldsToReturn);
    return res.status(200).json(user);
});

// Controller to fetch details of a single user
export const getSingleUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select(fieldsToReturn);
    return res.status(200).json(user);
});

// Controller to fetch details of all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select(fieldsToReturn);
    return res.status(200).json({ total: users.length, users });
});
