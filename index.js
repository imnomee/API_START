import express from 'express'; // Importing Express framework
import dotenv from 'dotenv'; // Importing dotenv to load environment variables
import mongoose from 'mongoose'; // Importing Mongoose for MongoDB interaction
import asyncHandler from 'express-async-handler'; // Importing express-async-handler for error handling with async routes
import cookieParser from 'cookie-parser'; // Importing cookie-parser for handling cookies
import chalk from 'chalk'; // Importing chalk for colored console logs

// Import routes - You should replace this with your actual route files
import userRoutes from './routes/user.routes.js';

dotenv.config(); // Loading environment variables from .env file
const app = express(); // Creating an instance of Express

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

// Use routes - Mounting route middleware for user routes
app.use('/api/users', asyncHandler(userRoutes));

const port = process.env.PORT || 5000; // Setting the port for the server to listen on

// Connect to MongoDB and start server
async function startServer() {
    try {
        // Connect to MongoDB using the provided URI from environment variables
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Server'); // Log success message when connected
        // Start the Express server and listen for incoming requests
        app.listen(port, () => {
            console.log(
                chalk.blueBright(
                    `Server is running on >> http://localhost:${port}...`
                )
            );
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error); // Log error if MongoDB connection fails
        process.exit(1); // Exit with failure status code
    }
}

// Catch-all route handler for undefined routes
app.use('*', (req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack trace
    // Respond with the appropriate HTTP status code and error message
    return res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

// Validate required environment variables
if (!process.env.MONGO_URI) {
    console.error('MongoDB URI not provided.'); // Log error if MongoDB URI is missing
    process.exit(1); // Exit with failure status code
}

startServer(); // Start the server
