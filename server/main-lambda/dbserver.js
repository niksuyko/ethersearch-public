import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serverless from 'serverless-http';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import indexRoutes from './routes/index.js';
import trendingRoutes from './routes/trendingRoutes.js';
import liveCoinRoutes from './routes/liveCoinRoutes.js';

const app = express();

// CORS Middleware
app.use(cors({
    origin: 'https://master.djw8msprmh588.amplifyapp.com',
    credentials: true
}));

// Ensure CORS Headers are set
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://master.djw8msprmh588.amplifyapp.com');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json());

// Use Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/contracts', contractRoutes);
app.use('/trending', trendingRoutes);
app.use('/liveCoin', liveCoinRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the app as a Lambda function
export const handler = serverless(app);
