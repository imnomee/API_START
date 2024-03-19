import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { COOKIEOPTIONS } from '../utils/constants.js';
import { createToken } from '../utils/token.handler.js';

export const registerUser = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    return res.status(201).json({ message: 'User created', user });
};

export const loginUser = async (req, res) => {
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

    const token = createToken({ userId: user._id, role: user.role });

    res.cookie('token', token, COOKIEOPTIONS);

    return res.status(200).json({ msg: 'User logged in successfully.' });
};

export const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password');
    return res.status(200).json({ total: users.length, users });
};
