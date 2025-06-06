const pool = require('../config/db');

// Get all posts
exports.getAllPosts = async (req, res) =>
{
    let connection;
    try
    {
        connection = await pool.getConnection();
        const [rows] = await connection.execute
        (`
            SELECT
                p.postID,
                p.title,
                p.content,
                p.Image,
                p.dateCreated,
                u.userID,
                u.firstName AS authorFirstName,
                u.lastName AS authorLastName
            FROM
                Post p
            JOIN
                Users u ON p.userID = u.userID
            ORDER BY p.dateCreated DESC
        `);
        res.json(rows);
    }
    catch (err)
    {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Error fetching posts', error: err.message });
    }
    finally
    {
        if (connection) connection.release();
    }
};

// Get single post by ID with comments and reactions
exports.getPostById = async (req, res) =>
{
    let connection;
    try
    {
        const postId = req.params.id;

        connection = await pool.getConnection();

        const [postRows] = await connection.execute
        (
            `SELECT
                p.postID,
                p.title,
                p.content,
                p.Image,
                p.dateCreated,
                u.userID AS authorID,
                u.firstName AS authorFirstName,
                u.lastName AS authorLastName,
                u.email AS authorEmail
            FROM
                Post p
            JOIN
                Users u ON p.userID = u.userID
            WHERE
                p.postID = ?`,
            [postId]
        );

        if (postRows.length === 0)
        {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const post = postRows[0];

        const [commentRows] = await connection.execute
        (
            `SELECT
                c.commentID,
                c.comment,
                c.dateCreated,
                u.userID AS commenterID,
                u.firstName AS commenterFirstName,
                u.lastName AS commenterLastName
            FROM
                Comments c
            JOIN
                Users u ON c.userID = u.userID
            WHERE
                c.postID = ?
            ORDER BY c.dateCreated ASC`,
            [postId]
        );
        post.comments = commentRows;

        const [reactRows] = await connection.execute
        (
            `SELECT
                r.reactID,
                r.react,
                u.userID AS reactorID,
                u.firstName AS reactorFirstName,
                u.lastName AS reactorLastName
            FROM
                React r
            JOIN
                Users u ON r.userID = u.userID
            WHERE
                r.entityID = ? AND r.entityType = 'post'`,
            [postId]
        );
        post.reactions = reactRows;

        res.json(post);

    }
    catch (err)
    {
        console.error('Error fetching post details:', err);
        res.status(500).json({ message: 'Error fetching post details', error: err.message });
    }
    finally
    {
        if (connection) connection.release();
    }
};

// Create a new post
exports.createPost = async (req, res) =>
{
    let connection;
    try
    {
        const { title, content, Image, userID } = req.body;

        if (!title || !content || !userID)
        {
            return res.status(400).json({ message: 'Title, content, and userID are required.' });
        }

        connection = await pool.getConnection();
        const [userCheck] = await connection.execute('SELECT userID FROM Users WHERE userID = ?', [userID]);
        if (userCheck.length === 0)
        {
            return res.status(404).json({ message: 'Author (userID) not found.' });
        }

        const [result] = await connection.execute
        (
            'INSERT INTO Post (title, content, Image, userID) VALUES (?, ?, ?, ?)',
            [title, content, Image, userID]
        );

        res.status(201).json
        ({
            message: 'Post created successfully',
            postID: result.insertId,
            post: { title, content, Image, userID }
        });

    }
    catch (err)
    {
        console.error('Error creating post:', err);
        if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW')
        {
            return res.status(400).json({ message: 'Invalid userID provided. User does not exist.', error: err.message });
        }
        res.status(500).json({ message: 'Error creating post', error: err.message });
    }
    finally
    {
        if (connection) connection.release();
    }
};

// Update a post by ID
exports.updatePost = async (req, res) =>
{
    let connection;
    try
    {
        const postId = req.params.id;
        const { title, content, Image } = req.body;

        if (!title && !content && !Image)
        {
            return res.status(400).json({ message: 'At least one field (title, content, or Image) must be provided for update.' });
        }

        connection = await pool.getConnection();

        const updateFields = [];
        const updateValues = [];
        if (title !== undefined) { updateFields.push('title = ?'); updateValues.push(title); }
        if (content !== undefined) { updateFields.push('content = ?'); updateValues.push(content); }
        if (Image !== undefined) { updateFields.push('Image = ?'); updateValues.push(Image); }

        if (updateFields.length === 0)
        {
            return res.status(400).json({ message: 'No valid fields provided for update.' });
        }

        const query = `UPDATE Post SET ${updateFields.join(', ')} WHERE postID = ?`;
        updateValues.push(postId);

        const [result] = await connection.execute(query, updateValues);

        if (result.affectedRows === 0)
        {
            return res.status(404).json({ message: 'Post not found or no changes were made.' });
        }

        res.json({ message: 'Post updated successfully' });

    }
    catch (err)
    {
        console.error('Error updating post:', err);
        res.status(500).json({ message: 'Error updating post', error: err.message });
    }
    finally 
    {
        if (connection) connection.release();
    }
};

// Delete a post by ID
exports.deletePost = async (req, res) =>
{
    let connection;
    try
    {
        const postId = req.params.id;

        connection = await pool.getConnection();

        const [result] = await connection.execute
        (
            'DELETE FROM Post WHERE postID = ?',
            [postId]
        );

        if (result.affectedRows === 0)
        {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(200).json({ message: 'Post deleted successfully.' });

    }
    catch (err)
    {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Error deleting post', error: err.message });
    }
    finally
    {
        if (connection) connection.release();
    }
};