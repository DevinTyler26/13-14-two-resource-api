'use strict';

import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Model from '../model/carModel';

const modelRouter = new Router();

modelRouter.post('/api/models', (req, res, next) => {
  Model.init()
    .then(() => {
      logger.log(logger.INFO, `Model Router: POST BEFORE save: ${JSON.stringify(req.body)}`);
      return new Model(req.body).save();
    })
    .then((newModel) => {
      logger.log(logger.INFO, `Model Router: POST AFTER save: ${JSON.stringify(newModel)}`);    
      res.json(newModel);
    })
    .catch(next);
});

// modelRouter.get('/api/models', (req, res, next) => {
//   Model.init()
//     .then(() => {
//       return Model.find({});
//     })
//     .then((foundCarModels) => {
//       logger.log(logger.INFO, `Car Model Router found the model ${JSON.stringify(foundCarModels)}`);
//       res.json(foundCarModels);
//     })
//     .catch(next);
// });

modelRouter.get('/api/models/:id?', (req, res, next) => {
  if (!req.params.id) {
    return next(new HttpErrors(400, 'Did not enter an ID'));
  }

  Model.init()
    .then(() => {
      return Model.findOne({ _id: req.params.id });
    })
    .then((foundModel) => {
      logger.log(logger.INFO, `Model Router: AFTER getting model: ${JSON.stringify(foundModel)}`);    
      return res.json(foundModel);
    })
    .catch(next);
  return undefined;
});

modelRouter.put('/api/models/:id?', (req, res, next) => {
  if (!req.params.id) {
    logger.log(logger.INFO, 'Model Router PUT api/models: Responding with 400 code for no id passed in');
    return res.sendStatus(400);
  }

  const options = {
    new: true,
    runValidators: true,
  };

  Model.init()
    .then(() => {
      return Model.findByIdAndUpdate(req.params.id, req.body, options);
    })
    .then((updatedModel) => {
      logger.log(logger.INFO, `Model Router PUT responding with a 200 status code for successful update to car: ${updatedModel}`);
      return res.json(updatedModel);
    })
    .catch(next);
  return undefined;
});

export default modelRouter;
