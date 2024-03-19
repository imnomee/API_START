import jwt from 'jsonwebtoken';

export const userValidator = (req, res, next) => {
    // Check if the user is logged in
    if (!req.cookies.token) {
        return res
            .status(401)
            .json({ error: 'Unauthorized: User not logged in' });
    }
    next();
};
