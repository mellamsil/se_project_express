# WTWR (What to Wear?) API

## Project Description

The WTWR API is a backend server designed to handle user authentication, clothing item management, and interactions between users and clothing items. The API provides endpoints for user registration, login, profile updates, clothing item creation, deletion, and liking/disliking items.

## Technologies and Techniques Used

 Node.js
 Express.js
 MongoDB
 Mongoose
 ES6
 CORS
 Prettier
 ESLint (airbnb-base configuration)
 JSON Web Tokens (JWT) for authentication

## API Endpoints

### User Routes

 `POST /signin`: Log in a user
 `POST /signup`: Create a new user
 `GET /users/me`: Return the logged-in user data
 `PATCH /users/me`: Update the user's profile

### Clothing Item Routes

 `GET /items`: Return all clothing items
 `POST /items`: Create a new clothing item
 `DELETE /items/:id`: Delete a clothing item by ID
 `PUT /items/:id/likes`: Like a clothing item
 `DELETE /items/:id/likes`: Unlike a clothing item

## Features

 User authentication using JSON Web Tokens (JWT)
 Clothing item management (create, delete, like/unlike)
 User profile updates
 Error handling with corresponding status codes

## Error Handling

 400: Invalid data or invalid ID
 401: Authorization error (incorrect email or password, invalid token)
 403: Forbidden (trying to remove another user's clothing item)
 404: Not found (user or clothing item not found)
 409: Conflict (email address already exists)
 500: Internal server error

## Installation and Running

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the server with hot reload
4. Run `npm run lint` to check for lint errors

## API Documentation

[Link:https://github.com/mellamsil/se_project_express.git ]

## Notes

 The API uses MongoDB as the database and connects to `mongodb://localhost:27017/wtwr_db` on startup.
 The `user` and `clothingItem` models are defined using Mongoose and exported in their respective schema files.
 The API uses Prettier for code formatting and ESLint for linting, with the airbnb-base configuration.
