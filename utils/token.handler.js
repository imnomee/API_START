// token.handler.js

import jwt from 'jsonwebtoken';

// Function to create a new JWT token
export const createToken = (payload) => {
    // Generate JWT token with payload and secret key
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expiration time
    });
    return token; // Return the generated token
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
