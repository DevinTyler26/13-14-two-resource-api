'use strict';

import HttpErrors from 'http-errors';
import pModelMap from '../../model/';
import logger from '../logger';

export default (req, res, next) => {
  logger.log(logger.INFO, 'Hitting MODEL Middleware');
  return pModelMap()
    .then((modelMap) => {
      const ifModelParams = req.params && req.params.model;
      const model = ifModelParams ? req.params.model : '';
      if (modelMap[model]) {
        req.model = modelMap[model].default;
        logger.log(logger.INFO, 'MODEL Middleware: Successfully attached model to req');
        return next();
      }
      logger.log(logger.ERROR, 'MODEL Middleware: Made a bad req for model that does not exist');
      return next(new HttpErrors(400, 'You did not enter a proper mongoose model'));
    })
    .catch(next);
};
