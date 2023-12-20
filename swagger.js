const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'TrelloDash API',
    description: 'API for TrelloDash',
  },
  host: 'localhost:3001'
};

const outputFile = './swagger-output.json';
const routes = ['./server/index.js']; 

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);