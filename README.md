# WTWR (What to Wear?): Back End

## Project Description

I've designed the WTWR back-end project to create a server for the WTWR application, providing a robust API and user authorization. My goal with this project is to demonstrate a deeper understanding of working with databases, setting up security and testing, and deploying web applications on a remote machine.

## Functionality

The server will provide a RESTful API for managing clothing items and user interactions, including:
 User registration and authorization
 Clothing item management (create, read, update, delete)
 API endpoints for retrieving and manipulating data

## Technologies and Techniques Used

I've used the following technologies and techniques:
 Node.js as the server-side runtime environment
 Express.js as the web framework
 MongoDB as the NoSQL database management system
 Mongoose as the ODM (Object Data Modeling) library
 Nodemon for hot reload during development

## Running the Project

To run the project, I use:
 `npm run start` — to launch the server
 `npm run dev` — to launch the server with the hot reload feature

## Testing with Postman

To test the API endpoints, I use Postman to send HTTP requests to the server. Make sure to include the necessary headers, query parameters, and request bodies as specified in the API documentation. I've managed version control and collaboration using GitHub.

Some example endpoints to test:

- User registration: `POST /signup`
- User login: `POST /signin`
- Get all clothing items: `GET /items`
- Create a new clothing item: `POST /items`

Before committing my code, I make sure to edit the `sprint.txt` file in the root folder to reflect the current sprint number, which is Sprint 12, the file contains the number `12`. This ensures that my project is properly tracked and version controlled.
