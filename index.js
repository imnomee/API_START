import 'express-async-errors'; // Import to handle async errors in Express
import express from 'express';
import chalk from 'chalk'; // For colored console output
import dotenv from 'dotenv'; // For environment variables
import morgan from 'morgan'; // For logging HTTP requests
import itemsRouter from './routes/items.router.js'; // Router for items endpoints
import mongoose from 'mongoose'; // MongoDB ORM

dotenv.config(); // Load environment variables from .env file
const app = express(); // Create Express application

// Middleware to parse JSON bodies of incoming requests
app.use(express.json());

// Middleware for HTTP request logging in development environment
app.use(morgan('dev'));

// Route handler for items endpoints
app.use('/api/v1/items', itemsRouter);

// Middleware for handling 404 errors (Route not found)
app.use('*', (req, res) => {
    return res.status(404).json({ error: 'Not Found middleware' });
});

// Middleware for handling server errors (500 Internal Server Error)
app.use((err, req, res, next) => {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
});

const port = process.env.PORT || 5000; // Default port

// Connect to MongoDB and start the Express server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        // Start the Express server
        app.listen(port, () => {
            console.log(
                `Server is running on\n>> ${chalk.blue(
                    `http://localhost:${port}`
                )}...`
            );
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure status code
    });
