const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     description: Returns a list of all registered users in the system. Password fields are excluded for security.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user.
 *     tags: [Users]
 *     description: Creates a new user account with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           examples:
 *             newUser:
 *               value:
 *                 firstName: Exa
 *                 lastName: Mple
 *                 email: Exa.Mple@example.com
 *                 password: mySecretPassword123
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 userID:
 *                   type: integer
 *                   example: 4
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., missing required fields).
 *       409:
 *         description: Conflict (e.g., email already exists).
 *       500:
 *         description: Internal server error.
 */
router.post('/', userController.createUser);

module.exports = router;