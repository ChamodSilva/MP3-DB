// Import required packages
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Import project files
const dotenv = require('dotenv');
const pool = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// --- Swagger Definition ---
const swaggerOptions =
{
    swaggerDefinition:
    {
        openapi: '3.0.0',
        info:
        {
            title: 'Code Book',
            version: '1.0.0',
            description: 'Like the other social media platform 😏, but for coding!',
            contact:
            {
                name: 'Chamod Silva',
                email: 'my email :P'
            },
        },
        servers:
        [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Local development server',
            },
        ],
        components:
        {
            schemas:
            {
                User:
                {
                    type: 'object',
                    properties:
                    {
                        userID: { type: 'integer', readOnly: true, description: 'Auto-generated ID of the user' },
                        firstName: { type: 'string', description: 'User\'s first name' },
                        lastName: { type: 'string', description: 'User\'s last name' },
                        email: { type: 'string', format: 'email', unique: true, description: 'User\'s email address (unique)' },
                        password: { type: 'string', format: 'password', writeOnly: true, description: 'User\'s password (hashed)' },
                        joinDate: { type: 'string', format: 'date-time', readOnly: true, description: 'Date user joined' }
                    },
                    required: ['firstName', 'lastName', 'email', 'password']
                },
                Post:
                {
                    type: 'object',
                    properties:
                    {
                        postID: { type: 'integer', readOnly: true, description: 'Auto-generated ID of the post' },
                        title: { type: 'string', description: 'Title of the post' },
                        content: { type: 'string', description: 'Content of the post' },
                        Image: { type: 'string', format: 'url', nullable: true, description: 'URL of an image associated with the post' },
                        dateCreated: { type: 'string', format: 'date-time', readOnly: true, description: 'Date post was created' },
                        userID: { type: 'integer', description: 'ID of the user who authored the post' }
                    },
                    required: ['title', 'content', 'userID']
                },
                Comment:
                {
                    type: 'object',
                    properties:
                    {
                        commentID: { type: 'integer', readOnly: true },
                        userID: { type: 'integer' },
                        postID: { type: 'integer' },
                        comment: { type: 'string' },
                        dateCreated: { type: 'string', format: 'date-time', readOnly: true }
                    },
                    required: ['userID', 'postID', 'comment']
                },
                React:
                {
                    type: 'object',
                    properties:
                    {
                        reactID: { type: 'integer', readOnly: true },
                        userID: { type: 'integer' },
                        entityID: { type: 'integer' },
                        entityType: { type: 'string', enum: ['post', 'comment'] },
                        react: { type: 'string' }
                    },
                    required: ['userID', 'entityID', 'entityType', 'react']
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Looks for JSDoc comments in all .js files in the routes folder
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Main API Routes ---
app.use('/api/users', userRoutes); // All user-related routes start with /api/users
app.use('/api/posts', postRoutes); // All post-related routes start with /api/posts

// Basic Route for testing the server
app.get('/', (req, res) =>
{
    res.send('Welcome to Code Book!');
});

// --- Start the server ---
app.listen(PORT, () =>
{
    console.log(`Code Book Server running on port ${PORT}`);
    console.log(`Access API at: http://localhost:${PORT}/api`);
    console.log(`Access Swagger Docs at: http://localhost:${PORT}/api-docs`);
});