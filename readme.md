# Task Manager API

This is the backend of the Task Manager application. It provides RESTful API endpoints for managing tasks.

## Features
- Create, read, update, and delete tasks.
- Filter tasks by their status (completed or pending).
- Input validation with `express-validator`.
- API documentation using Swagger.

## Technologies
- Node.js
- Express.js
- MongoDB
- Mongoose
- Swagger

## Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/AlejoE02/task-manager-backend.git>
   cd task-manager-backend
2. Install dependencies:
   ```bash
   npm install
3. Create a .env file and add the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@taskmanagercluster.sgpvk.mongodb.net/?retryWrites=true&w=majority&appName=TaskManagerCluster
4. Start the server
   ```
   npm start
5. The API will be available at `http://localhost:5000`
6. Credentials for MongoDB
  -- user: TaskManagerUser
  -- password: LJMupbaDdWgG9pBy

## API Endpoints

### Base URL
`http://localhost:5000/api`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| Post | /tasks | Create a new Task |
| Get | /tasks | Get a list of all tasks |
| Get | /tasks?status= | Get a list of 'completed' or 'pending' |
| Put | /tasks/:id | Update a task by ID |
| Delete| /tasks/:id | Delete a task by ID |

For detailed documentation, visit the Swagger UI:
http://localhost:5000/api-docs

## Development Scripts
  - `npm start`: Starts the server
  - `npm run dev`: Starts the server with hot reload using `nodemon`.

## License

[MIT](https://choosealicense.com/licenses/mit/)