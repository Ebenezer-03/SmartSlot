const express = require('express');
const app = express();
const createhealthassessment = require('./routes/task');

const connectDB = require('./db/connect');
require('dotenv').config();
const notFound = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');



//middleware
app.use(express.json());


app.use('/api/v1/tasks', createhealthassessment);


app.use(notFound);
app.use(errorHandlerMiddleware);
const port = process.env.PORT || 5000;


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();