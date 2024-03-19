import { Router } from 'express';
import User from '../models/user.model.js';

const router = Router();

const registerUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        return res.status(201).json({ message: 'User created', user }); // Create a new user and return its details
    } catch (error) {
        return res.status(400).json({ error: error.message }); // Handle registration errors
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        // Return the total number of users and the list of users (excluding sensitive fields like password)
        return res.status(200).json({ total: users.length, users });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' }); // Handle server errors
    }
};

router.post('/register', registerUser); // Route to register a new user
router.get('/', getAllUsers); // Route to get all users

export default router;
