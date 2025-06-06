# MP3-DB

Mini-Project 3 Database

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ChamodSilva/MP3-DB.git
   cd MP3-DB
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env` and update the values as needed for your MySQL setup:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=code_book_db
     ```

4. **Set up the database:**

<details>
<summary><strong>▶️ Example Table Setup (SQL)</strong></summary>

```sql
-- Create the database
CREATE DATABASE code_book_db;

-- Switch to using your new database
USE code_book_db;

-- Create the Users Table
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    joinDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create the Post Table
CREATE TABLE Post (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    Image VARCHAR(2048),
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    userID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create the Comments Table
CREATE TABLE Comments (
    commentID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    postID INT NOT NULL,
    comment TEXT NOT NULL,
    dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (postID) REFERENCES Post(postID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Create the React Table
CREATE TABLE React (
    reactID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    entityID INT NOT NULL,
    entityType VARCHAR(10) NOT NULL,
    react VARCHAR(20) NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```
</details>

<details>
<summary><strong>▶️ Example Data Population (SQL)</strong></summary>

```sql
-- Populate DATABASE:
USE code_book_db;

-- Insert Sample Users:
INSERT INTO Users (firstName, lastName, email, password) VALUES
('Exa', 'mp', 'Exa.Mple@example.com', 'IHopeThisPasswordIsSecure'),
('Test', 'User', 'Test.User@example.com', 'TestPassword!');

-- Insert Sample Posts:
INSERT INTO Post (title, content, Image, userID) VALUES
('Hi my name is Example!', 'I wanted to make this post as an example.', 'http://example.com/example.jpg', 1),
('Hi I am Test!', 'This is just a test post!', NULL, 2);

-- Insert Sample Comments:
INSERT INTO Comments (userID, postID, comment) VALUES
(2, 1, 'Great post, Exa!'),
(1, 2, 'Good one, Test!'),
(2, 1, 'I am also going to make a post'),
(1, 1, 'Go for it!');

-- Insert Sample Reacts:
INSERT INTO React (userID, entityID, entityType, react) VALUES
(1, 1, 'post', 'like'),
(2, 1, 'post', 'love'),
(1, 2, 'post', 'haha'),
(2, 3, 'comment', 'like');
```
</details>

### Running the Server

```sh
node server.js
```

Once Running:
- The API will be available at: [http://localhost:3000/api](http://localhost:3000/api)
- Swagger API docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### API Endpoints

- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/posts` - List all posts
- `POST /api/posts` - Create a new post
- `GET /api/posts/:id` - Get a post by ID (with comments and reactions)
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

See [Swagger docs](http://localhost:3000/api-docs) for full API documentation.

---