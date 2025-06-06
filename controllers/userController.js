const pool = require('../config/db');

// Get all users
exports.getAllUsers = async (req, res) =>
{
    let connection;
    try
    {
        connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT userID, firstName, lastName, email, joinDate FROM Users');
        res.json(rows);
    }
    catch (err)
    {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
    finally
    {
        if (connection) connection.release();
    }
};

// Create a new user
exports.createUser = async (req, res) =>
{
    let connection;
    try
    {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password)
        {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        connection = await pool.getConnection();
        const [result] = await connection.execute
        (
            'INSERT INTO Users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, password]
        );

        res.status(201).json
        ({
            message: 'User created successfully',
            userID: result.insertId,
            user: { firstName, lastName, email }
        });

    }
    catch (err)
    {
        console.error('Error creating user:', err);
        if (err.code === 'ER_DUP_ENTRY')
        {
            return res.status(409).json({ message: 'Email already exists.', error: err.message });
        }
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
    finally
    {
        if (connection) connection.release();
    }
};