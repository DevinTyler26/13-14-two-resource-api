'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import CarMake from '../model/carMake';

const carMakeRouter = new Router();

carMakeRouter.post('/api/make', (req, res, next) => {
  CarMake.init()
    .then(() => {
      logger.log(logger.INFO, `Car Make Router BEFORE Save: Saving a new Car Make ${JSON.stringify(req.body)}`);
      return new CarMake(req.body).save();
    })
    .then((newCarMake) => {
      logger.log(logger.INFO, `Car Make Router AFTER Save: Saving a new Car Make ${JSON.stringify(newCarMake)}`);
      return res.json(newCarMake);
    })
    .catch(next);
  return undefined;
});

carMakeRouter.get('/api/make/:id?', (req, res, next) => {
  CarMake.init()
    .then(() => {
      return CarMake.findOne({ _id: req.params.id });
    })
    .then((foundCarMake) => {
      logger.log(logger.INFO, `Car Make Router found the model ${JSON.stringify(foundCarMake)}`);
      res.json(foundCarMake);
    })
    .catch(next);
});

carMakeRouter.put('/api/make/:id?', (req, res, next) => {
  if (!req.params.id) {
    logger.log(logger.INFO, 'Make Router PUT api/models: Responding with 400 code for no id passed in');
    return res.sendStatus(400);
  }

  const options = {
    new: true,
    runValidators: true,
  };

  CarMake.init()
    .then(() => {
      return CarMake.findByIdAndUpdate(req.params.id, req.body, options);
    })
    .then((updatedCarMake) => {
      logger.log(logger.INFO, `Make Router PUT responding with a 200 status code for successful update to car: ${updatedCarMake}`);
      return res.json(updatedCarMake);
    })
    .catch(next);
  return undefined;
});

export default carMakeRouter;
