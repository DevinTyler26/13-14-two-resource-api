'use strict';

import { Router } from 'express';
import HttpErrors from 'http-errors';
import modelFinder from '../lib/middleware/model-middleware';
import logger from '../lib/logger';

const modelRouter = new Router();

modelRouter.param('model', modelFinder);

modelRouter.post('/api/:model', (req, res, next) => {
  const Model = req.model;
  Model.init()
    .then(() => {
      logger.log(logger.INFO, `Model-Router, before saving a new ${req.params.model}: ${JSON.stringify(res.body)}`);
      return new Model(req.body).save();
    })
    .then((newResource) => {
      logger.log(logger.INFO, `Model-Router after saving a new ${req.params.model}: ${JSON.stringify(newResource)}`);
      return res.json(newResource);
    })
    .catch(next);
});

modelRouter.get('/api/:model/:id?', (req, res, next) => {
  if (!req.params.id) {
    return next(new HttpErrors(400, `No ${req.model} ID entered`));
  }
  const Model = req.model;
  Model.init()
    .then(() => {
      return Model.findOne({ _id: req.params.id });
    })
    .then((foundModel) => {
      logger.log(logger.INFO, `Model-Router: Found the MODEL ${JSON.stringify(foundModel)}`);
      return res.json(foundModel);
    })
    .catch(next);
  return undefined;
});

modelRouter.get('/api/:model', (req, res, next) => {
  const Model = req.model;
  Model.init()
    .then(() => {
      return Model.find({});
    })
    .then((foundCarMakes) => {
      logger.log(logger.INFO, `Car Make Router found the model ${JSON.stringify(foundCarMakes)}`);
      return res.json(foundCarMakes);
    })
    .catch(next);
});


modelRouter.put('/api/:model/:id?', (req, res, next) => {
  if (!req.params.id) {
    logger.log(logger.INFO, 'Make Router PUT api/models: Responding with 400 code for no id passed in');
    return res.sendStatus(400);
  }
  const Model = req.model;

  const options = {
    new: true,
    runValidators: true,
  };

  Model.init()
    .then(() => {
      return Model.findByIdAndUpdate(req.params.id, req.body, options);
    })
    .then((updatedModel) => {
      logger.log(logger.INFO, `Make Router PUT responding with a 200 status code for successful update to car: ${updatedModel}`);
      return res.json(updatedModel);
    })
    .catch(next);
  return undefined;
});

export default modelRouter;
