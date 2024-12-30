const express = require("express");
const router = express.Router();
const Task = require("../models/task.model");
const { check, validationResult } = require("express-validator");

//console.log('Tasks routes loaded');

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task
 *                 example: "Buy groceries"
 *               description:
 *                 type: string
 *                 description: Optional description of the task
 *                 example: "Remember to buy milk and bread"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the created task
 *                   example: "64b72c5e9e8c1c001f3e45d7"
 *                 title:
 *                   type: string
 *                   example: "Buy groceries"
 *                 description:
 *                   type: string
 *                   example: "Remember to buy milk and bread"
 *                 completed:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-12-01T15:23:45.123Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "title"
 *                       message:
 *                         type: string
 *                         example: "Title is required"
 */
router.post(
  "/tasks",
  [
    check("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title must not be more than 100 characters long"),
    check("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description must not be more than 500 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }
    try {
      const { title, description } = req.body;

      const newTask = new Task({ title, description });
      await newTask.save();

      res.status(201).json(newTask);
    } catch (err) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the task" });
    }
  }
);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: completed
 *         description: Filter tasks by their completion status
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The task's unique identifier
 *                     example: "64b72c5e9e8c1c001f3e45d7"
 *                   title:
 *                     type: string
 *                     description: The title of the task
 *                     example: "Buy groceries"
 *                   description:
 *                     type: string
 *                     description: Description of the task
 *                     example: "Buy milk and bread"
 *                   completed:
 *                     type: boolean
 *                     description: Whether the task is completed
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Date when the task was created
 *                     example: "2023-12-01T15:23:45.123Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while fetching the tasks"
 */
router.get("/tasks", async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status === "completed") {
      filter.completed = true;
    } else if (status === "pending") {
      filter.completed = false;
    }

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by specific ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The task ID
 *         schema:
 *           type: string
 *           example: "64b72c5e9e8c1c001f3e45d7"
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The task's unique identifier
 *                   example: "64b72c5e9e8c1c001f3e45d7"
 *                 title:
 *                   type: string
 *                   description: The title of the task
 *                   example: "Buy groceries"
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: "Buy milk and bread"
 *                 completed:
 *                   type: boolean
 *                   description: Whether the task is completed
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date when the task was created
 *                   example: "2023-12-01T15:23:45.123Z"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while fetching the task"
 */
router.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the task" });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The task ID
 *         schema:
 *           type: string
 *           example: "64b72c5e9e8c1c001f3e45d7"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task
 *                 example: "Buy groceries"
 *               description:
 *                 type: string
 *                 description: The description of the task
 *                 example: "Buy milk and bread"
 *               completed:
 *                 type: boolean
 *                 description: Completion status of the task
 *                 example: true
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The task's unique identifier
 *                   example: "64b72c5e9e8c1c001f3e45d7"
 *                 title:
 *                   type: string
 *                   description: The title of the task
 *                   example: "Buy groceries"
 *                 description:
 *                   type: string
 *                   description: Description of the task
 *                   example: "Buy milk and bread"
 *                 completed:
 *                   type: boolean
 *                   description: Whether the task is completed
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Date when the task was created
 *                   example: "2023-12-01T15:23:45.123Z"
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/tasks/:id",
  [
    check("title")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Title must not be more than 100 characters long"),
    check("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description must not be more than 500 characters long"),
    check("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean value"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      const formattedErrors = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      }));
      return res.status(400).json({ errors: formattedErrors });
    }

    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;
      const updateTask = await Task.findByIdAndUpdate(
        id,
        { title, description, completed },
        { new: true, runValidators: true }
      );
      if (!updateTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(updateTask);
    } catch (err) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the task" });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The task ID
 *         schema:
 *           type: string
 *           example: "64b72c5e9e8c1c001f3e45d7"
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */
router.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteTask = await Task.findByIdAndDelete(id);
    if (!deleteTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the task" });
  }
});

module.exports = router;
