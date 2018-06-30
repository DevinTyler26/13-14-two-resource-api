'use strict'; 

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './logger';
import carMakeRouter from '../router/carMake-router';
import modelRouter from './../router/carModel-router';
import errorMiddleware from '../lib/middleware/error-middleware';
import loggerMiddleware from '../lib/middleware/logger-middleware';

const app = express();
const PORT = process.env.PORT || 3000;
let server = null;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(loggerMiddleware);
app.use(carMakeRouter);
app.use(modelRouter);
app.use(errorMiddleware);

app.all('*', (req, res) => {
  console.log('RETURNING 404 FROM THE CATCH ALL');
  return res.sendStatus(404).send('Route Not Registered');
});

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(PORT, () => {
        console.log('Server is ON:', PORT);
      });
    })
    .catch((err) => {
      throw err;
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is OFF');
      });
    })
    .catch((err) => {
      throw err;
    });
};

export { startServer, stopServer };
