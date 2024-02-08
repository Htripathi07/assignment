# Task Management System

This is a Node.js application for scheduling and tracking tasks. It includes features such as user authentication, task management, job scheduling for reminders, queue management, caching, error handling, and documentation.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js
- MongoDB
- Redis (optional, for caching)

## Getting Started

1. Clone the repository:

```
git clone <repository-url>
```

2. Install dependencies:

```
cd desired_folder
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret-key>
```

Replace `<your-mongodb-uri>`, `<your-redis-url>`, and `<your-secret-key>` with your actual MongoDB URI, Redis URL (if using Redis), and a secret key for JWT token.

4. Start the server:

```
npm start
```

The server should now be running on the specified port (default is 3000).

## API Endpoints

### User Authentication

- `POST /register`: Register a new user.
- `POST /login`: Login with existing user credentials.

### Task Management

- `POST /tasks`: Create a new task.
- `PUT /tasks/:id`: Update an existing task.
- `DELETE /tasks/:id`: Delete a task.
- `GET /tasks`: Retrieve all tasks for the authenticated user.

### Cache Endpoint

- `GET /cache/:taskId`: Retrieve cached task data by task ID.

## Job Scheduler

The job scheduler automatically sends reminders for upcoming tasks within 24 hours.

## Queue Management

Queue management is implemented for processing task updates asynchronously.

## Caching

Caching is implemented to improve retrieval performance of task data.

## Error Handling

Error handling is implemented to handle errors gracefully and return meaningful responses.

## Documentation

Comprehensive documentation of API endpoints, job scheduler setup, and other necessary information is provided in the code comments and this README file.
