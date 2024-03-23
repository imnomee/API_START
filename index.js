import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chalk from 'chalk';
import 'express-async-errors'; // Simplifies error handling for async functions
import { StatusCodes } from 'http-status-codes';
import itemsRouter from './routes/items.router.js';
import sellerRouter from './routes/sellers.router.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests to the console

// Routes setup
app.use('/api/v1/items', itemsRouter); // Items router
app.use('/api/v1/sellers', sellerRouter); // Sellers router

// Route for handling unknown routes
app.use('*', (req, res, next) => {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: 'Not found: 404' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err); // Log the error

    // Extract status code and error message
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const msg = err.message || 'Something went wrong: 500';

    // Send error response with appropriate status code and message
    return res.status(statusCode).json({ msg });
});

// Start server
const port = process.env.PORT || 5000;

try {
    // Connect to MongoDB database
    await mongoose.connect(process.env.MONGO_URI);

    // Start listening on specified port
    app.listen(port, () => {
        console.log(
            chalk.blue(`Server running at http://localhost:${port}/api/v1`)
        );
    });
} catch (err) {
    // Log and exit if connection to MongoDB fails
    console.error(err);
    process.exit(1);
}
