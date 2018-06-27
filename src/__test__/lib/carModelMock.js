'use strict';

import faker from 'faker';
import pCarMakeMock from '../../model/carMake';
import CarModel from '../../model/carModel';

export default () => {
  const mockData = {};
  return pCarMakeMock()
    .then((newCarMake) => {
      mockData.carMake = newCarMake;
    })
    .then(() => {
      const mockCarModel = {
        name: faker.name.firstName(),
        vin: faker.random.number(),
        carMakeId: mockData.carMake._id,
      };
      return new CarModel(mockCarModel).save();
    })
    .then((newCarModel) => {
      mockData.carModel = newCarModel;
      return mockData;
    })
    .catch((err) => {
      throw err;
    });
};
