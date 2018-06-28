'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import CarMake from '../model/carMake';
import CarModel from '../model/carModel';
import pCreateMockData from './lib/carModelMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/models`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => {
  Promise.all([
    CarMake.remove({}),
    CarModel.remove({}),    
  ]);
});

describe('POST /api/models', () => {
  test('200 POST for successful posting of a model', () => {
    return pCreateMockData()
      .then((mockData) => {
        const mockModel = {
          name: faker.name.firstName(),
          vin: faker.random.number(100000000, 999999999),
          carMakeId: mockData.carMake._id,
        };
        return superagent.post(apiUrl)
          .send(mockModel)
          .then((res) => {
            expect(res.status).toEqual(200);
          })
          .catch((err) => {
            throw err;
          });
      });
  });

  test('400 post: No path', () => {
    return pCreateMockData()
      .then((mockData) => {
        const mockModel = {
          // name: faker.name.firstName(),
          vin: faker.random.number(100000000, 999999999),
          carMakeId: mockData.carMake._id,
        };
        return superagent.post(apiUrl)
          .send(mockModel)
          .catch((err) => {
            expect(err.status).toEqual(400);
          });
      });
  });
});

describe('GET /api/models', () => {
  test('200 GET for successful fetching of a model', () => {
    return pCreateMockData()
      .then((mockData) => {
        return superagent.get(`${apiUrl}/${mockData.carModel._id}`);
      })
      .then((res) => {
        expect(res.status).toEqual(200);
      })
      .catch((err) => {
        throw err;
      });
  });
  test('404 GET: No Model with this ID', () => {
    return pCreateMockData()
      .then(() => {
        return superagent.get(`${apiUrl}/12343452`)
          .catch((err) => {
            expect(err.status).toEqual(404);
          });
      });
  });

  test('400 GET: No path', () => {
    return superagent.get(`${apiUrl}`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
});

describe('PUT request to /api/models', () => {
  test('200 PUT for successful update to a resource', () => {
    return pCreateMockData()
      .then((mockData) => {
        return superagent.put(`${apiUrl}/${mockData.carModel._id}`)
          .send({ name: 'updated name', vin: 'updated vin' })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.name).toEqual('updated name');
            expect(response.body.vin).toEqual('updated vin');  
            // expect(response.body._id.toString()).toEqual(mockData._id.toString());              
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  });

  test('404 PUT: No Model with this ID', () => {
    return pCreateMockData()
      .then(() => {
        return superagent.put(`${apiUrl}/12343452`)
          .catch((err) => {
            expect(err.status).toEqual(404);
          });
      });
  });

  test('400 PUT: No path', () => {
    return superagent.put(`${apiUrl}`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });
});
