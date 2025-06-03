const express = require('express');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- Database Connection Pool ---
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'sql12345',
    database: process.env.DB_NAME || 'code_book_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
pool.getConnection().then(connection =>
    {
        console.log('Successfully connected to the database!');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err =>
    {
        console.error('Database connection failed:', err.stack);
        process.exit(1); // Exit the process if DB connection fails
    });

// --- Basic Route for testing the server ---
app.get('/', (req, res) =>
{
    res.send('Welcome to the Social Media API!');
});

// --- Start the server ---
app.listen(PORT, () =>
{
    console.log(`Server running on port ${PORT}`);
    console.log(`Access it at: http://localhost:${PORT}`);
});