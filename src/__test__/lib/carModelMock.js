'use strict';

import faker from 'faker';
import CarModel from '../../model/carModel';
import pCarMakeMock from './carMakeMock';

export default () => {
  const mockData = {};
  return pCarMakeMock()
    .then((newCarMake) => {
      mockData.carMake = newCarMake;
    })
    .then(() => {
      const mockCarModel = {
        name: faker.name.firstName(),
        vin: faker.random.number(100000000, 999999999),
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
