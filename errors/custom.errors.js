import { StatusCodes } from 'http-status-codes';

// Base custom error class
export class CustomError extends Error {
    // Constructor function for creating instances of the CustomError class
    constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
        // Call the constructor of the base Error class with the provided message
        super(message);

        // Set the name property of the error to the name of the constructor
        this.name = this.constructor.name;

        // Set the statusCode property to the provided statusCode or default to 500 (Internal Server Error)
        this.statusCode = statusCode;
    }
}

// Specific error classes extending the base CustomError class

// Error class for "Not Found" errors
export class NotFoundError extends CustomError {
    // Constructor function for creating instances of the NotFoundError class
    constructor(message = 'Not found') {
        // Call the constructor of the base CustomError class with the provided message and status code for "Not Found" (404)
        super(message, StatusCodes.NOT_FOUND);
    }
}

// Error class for "Unauthorized" errors
export class UnauthorizedError extends CustomError {
    // Constructor function for creating instances of the UnauthorizedError class
    constructor(message = 'Unauthorized') {
        // Call the constructor of the base CustomError class with the provided message and status code for "Unauthorized" (401)
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

// Error class for "Bad Request" errors
export class BadRequestError extends CustomError {
    // Constructor function for creating instances of the BadRequestError class
    constructor(message = 'Bad request') {
        // Call the constructor of the base CustomError class with the provided message and status code for "Bad Request" (400)
        super(message, StatusCodes.BAD_REQUEST);
    }
}

// Other specific error classes can be added similarly...
