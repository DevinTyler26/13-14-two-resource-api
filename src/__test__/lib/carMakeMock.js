'use strict';

import faker from 'faker';
import CarMake from '../../model/carMake';

export default () => {
  const mockResourceToPOST = {
    make: faker.name.firstName(),
  };
  return new CarMake(mockResourceToPOST).save();
};
