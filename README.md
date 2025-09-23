//Tech Stach
Backend:Node.js,Express.js
Database: PostgreSQL with sequelize ORM
Authentication: JWT(Json web token)
security: bcrypt for password hashing


//Clone the Repository
git clone <repository-url>
cd BookStore

//Install dependencies
npm install

//DataBase setup
create a PostGres database named 'BookStore'


//environment configurations
create a .env file in the root directtory with the follwoing variables

PORT=5000
DB_NAME=BookStore
DB_PORT=5432
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root
JWT_SECRET=f8b2a7c3d9a41a6b91c7d5e6f3a2b0c4d7e1f5a9b8c3d2e4f1a7c9d0b2e3f6a1


//Run the Application
npm start


The server will start on `http://localhost:5000`



//Relationships
users-> Reviews : one user can have multiple reviews
Books-> Reviews : one book can have multiple reviews


//Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userName VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    gender ENUM('male', 'female', 'other'),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);


// Books Table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    author VARCHAR NOT NULL,
    genre VARCHAR NOT NULL,
    publishedYear INTEGER,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
    UNIQUE(title, author)
);

 //Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    userId UUID NOT NULL REFERENCES users(id),
    bookId UUID NOT NULL REFERENCES books(id),
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),
    UNIQUE(userId, bookId)
);

//API Documentation

//Base URL
`http://localhost:5000/api/v1`

// Authentication
except user routes remaining routes require authentication
Authorization: Bearer <your_jwt_token>


//User Endpoints

// Register User

POST /api/v1/user
{
    "userName": "saiteja",
    "email": "saiteja@gmail.com",
    "password": "Saiteja@123",
    "gender": "male"
}

Response:
{
    "message": "user created successfully..",
    "data": {
        "id": "uuid",
        "userName": "saiteja",
        "email": "saiteja@gmail.com",
        "gender": "male"
    }
}

// Login User

POST /api/v1/user/login
{
    "email": "saiteja@gmail.com",
    "password": "Saiteja@123"
}

Response:

{
    "message": "Login succesfull...",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


// Book Endpoints (Authentication Required)

// Create Book

POST /api/v1/book
{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic Literature",
    "publishedYear": 1925
}

// Get All Books (with pagination and search)
   GET /api/v1/book?page=1&limit=10&q=gatsby

Response:

{
    "success": true,
    "data": [
        {
            "id": "uuid",
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "genre": "Classic Literature",
            "publishedYear": 1925
        }
    ],
    "meta": {
        "totalItems": 1,
        "currentPage": 1,
        "totalPages": 1,
        "pageSize": 10
    }
}

//Get Book Details with Reviews(with pagination)

GET /api/v1/book/{book_id}?page=1&limit=5


 Add Review to Book

POST /api/v1/book/{book_id}/review

{
    "rating": 5,
    "comment": "Excellent book! Highly recommended."
}


 //Review Endpoints (Authentication Required)
   Update Review

PUT /api/v1/reviews/{review_id}

{
    "rating": 4,
    "comment": "Updated review comment"
}

//Delete Review

DELETE /api/v1/reviews/{review_id}




// Design Decisions 


// Database Design Decisions
  1.Soft Deletes: Not implemented 

// Validation Rules

  1.Password Complexity: Minimum 8 characters with uppercase, lowercase,    number, and special character

  2.Rating Range: 1-5 scale for reviews

  3.Comment Limit: 500 characters maximum for review comments

  4.Email Format: Standard email regex validation

// Pagination Strategy
   1.Default Limit: 10 items per page (reasonable for most use cases)
   2.Maximum Limit: 50 items per page (prevents server overload)
   3.Offset-based: Simple and sufficient for this use case

// Search Functionality
   1.Case-insensitive: Uses PostgreSQL ILIKE for better user experience
   2.Multi-field Search**: Searches across title, author, and genre
   3.Partial Matching: Supports substring searches

// Error Handling
   1.Consistent Response Format: Standardized error messages
   2.HTTP Status Codes: Proper status codes for different scenarios
   3.Input Validation: Server-side validation for all inputs

//Security Considerations
   1.Password Hashing: bcryptjs with salt rounds for secure password storage
   2.SQL Injection Prevention: Sequelize ORM provides protection











