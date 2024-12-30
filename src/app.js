const express = require('express');
const taskRoutes = require('./routes/task.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');

const app = express();

app.use(express.json());
app.use("/api", taskRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log("Swagger docs available at http://localhost:5000/api-docs");

module.exports = app;