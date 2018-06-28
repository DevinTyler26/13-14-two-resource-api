'use strict';

import util from 'util';
import fs from 'fs';

const pReadDirectory = util.promisify(fs.readdir);
const modelPath = `${__dirname}`;

export default () => {
  return pReadDirectory(modelPath)
    .then((files) => {
      const newFiles = files.filter(file => file !== 'index.js').map(file => `./${file}`);
      const modelMap = newFiles.reduce((storage, currFile) => {
      const file = require(currFile) /*eslint-disable-line*/
        const ifMongooseModel = file.default && file.default.modelName;
        const modelName = ifMongooseModel ? file.default.modelName : currFile;
        storage[modelName] = file;
        return storage;
      }, {});
      return modelMap;
    })
    .catch((err) => {
      throw err;
    });
};
