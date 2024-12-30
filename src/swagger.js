const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'A simple Task Manager API as a personal Project',
    },
    servers: [
      {
        url: 'http://localhost:5000',

      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
//console.log(swaggerDocs.paths);

module.exports = swaggerDocs;