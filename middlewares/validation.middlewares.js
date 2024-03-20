// Middleware to check if the user is an admin
import { verifyToken } from '../utils/token.handler.js';

export const adminCheck = (req, res, next) => {
    // Check if the user is an admin
    if (req.user.role === 'admin') {
        next(); // Proceed to the next middleware or route handler
    } else {
        // If user is not an admin, return forbidden error
        return res
            .status(403)
            .json({ error: 'Forbidden: Insufficient privileges' });
    }
};

// Middleware to validate user token and attach user information to request
export const tokenValidator = (req, res, next) => {
    // Check if the user is logged in (token exists in cookies)
    if (!req.cookies.token) {
        // If token is missing, return unauthorized error
        return res
            .status(401)
            .json({ error: 'Unauthorized: User not logged in' });
    }

    try {
        // Verify the token
        const decodedUser = verifyToken(req.cookies.token);

        // Attach the decoded user object to the request for further processing
        req.user = decodedUser;
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // If token verification fails, return unauthorized error
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
