const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

// Load environment
dotenv.config(); 

const pool = mysql.createPool
({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Health test to check if the server is connecting to the database or not.
pool.getConnection().then(connection =>
    {
        console.log("Health test successful!");
        connection.release();
    })
    .catch(err =>
    {
        console.error("Health test failed!", err.stack);
        process.exit(1);
    });

module.exports = pool; // Export the pool so other files can use it