import 'express-async-errors';
import express from 'express';
import chalk from 'chalk';
import morgan from 'morgan';
import dotenv from 'dotenv';
import itemsRouter from './routes/items.router.js';
import sellerRouter from './routes/sellers.router.js';
import mongoose from 'mongoose';
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/items', itemsRouter);
app.use('/api/v1/sellers', sellerRouter);

app.use('*', (req, res, next) => {
    return res.status(404).json({ msg: 'not found: 404' });
});

app.use((err, req, res, next) => {
    return res
        .status(500)
        .json({ msg: 'something went wrong: 500', error: err._message });
});

const port = process.env.PORT || 5000;

try {
    await mongoose.connect(process.env.MONGO_URI);

    app.listen(port, () => {
        console.log(chalk.blue(`http://localhost:${port}/api/v1`));
    });
} catch (err) {
    console.log(err);
    process.exit(1);
}
