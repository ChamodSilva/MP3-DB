const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Retrieve a list of all posts
 *     tags: [Posts]
 *     description: Returns a list of all posts and all relevant files.
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   postID: { type: integer }
 *                   title: { type: string }
 *                   content: { type: string }
 *                   Image: { type: string, nullable: true }
 *                   dateCreated: { type: string, format: date-time }
 *                   userID: { type: integer }
 *                   authorFirstName: { type: string }
 *                   authorLastName: { type: string }
 *       500:
 *         description: Internal server error
 */
router.get('/', postController.getAllPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Retrieve a single post by ID with all relevant information.
 *     tags: [Posts]
 *     description: Returns a single post object, including all relevant information.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to retrieve.
 *     responses:
 *       200:
 *         description: A single post object with nested comments and reactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postID: { type: integer, example: 1 }
 *                 title: { type: string, example: 'Example Post' }
 *                 content: { type: string, example: 'This is example content' }
 *                 Image: { type: string, nullable: true, example: 'http://example.com/example.jpg' }
 *                 dateCreated: { type: string, format: date-time, example: '2025-06-06T10:00:00Z' }
 *                 authorID: { type: integer, example: 1 }
 *                 authorFirstName: { type: string, example: 'Exa' }
 *                 authorLastName: { type: string, example: 'Mple' }
 *                 authorEmail: { type: string, example: 'Exa.Mple@example.com' }
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *                 reactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/React'
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', postController.getPostById);

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     description: Creates a new post with the provided title, content, optional image, and author ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *           examples:
 *             newPost:
 *               value:
 *                 title: "Swagger Docs Api Post"
 *                 content: "This was generated via the projects swagger documentation."
 *                 Image: "http://example.com/example.jpg"
 *                 userID: 1
 *     responses:
 *       201:
 *         description: Post created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: 'Post created successfully' }
 *                 postID: { type: integer, example: 5 }
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request (e.g., missing required fields).
 *       404:
 *         description: Author (userID) not found.
 *       500:
 *         description: Internal server error.
 */
router.post('/', postController.createPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update an existing post
 *     tags: [Posts]
 *     description: Updates an existing post by its ID. Please make sure one field (title, content, or Image) is provided.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string, description: 'New title of the post' }
 *               content: { type: string, description: 'New content of the post' }
 *               Image: { type: string, format: url, nullable: true, description: 'New image URL, or null to remove' }
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       400:
 *         description: Bad request (e.g. no valid fields for update).
 *       404:
 *         description: Post not found or no changes were made.
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', postController.updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     description: Deletes a post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to delete.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', postController.deletePost);

module.exports = router;