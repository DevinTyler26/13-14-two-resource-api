'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import CarMake from '../model/carMake';
import pCreateMockMake from './lib/carMakeMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/carMake`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => CarMake.remove({}));

describe('POST /api/make', () => {
  const mockResource = {
    name: faker.name.firstName(),
    country: faker.address.country(),
  };

  test('200 POST for successful POST of a Car Make', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(mockResource.name);
        expect(res.body.country).toEqual(mockResource.country);
        expect(res.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });
  test('400 post: No name', () => {
    return superagent.post(apiUrl)
      .send()
      .catch((err) => {
        console.log('INSIDE 400 ERROR FOR NO ID');
        expect(err.status).toEqual(400);
      });
  });
});

describe('GET /api/make', () => {
  test('200 GET for successful fetching of a car make', () => {
    let returnedCarMake;
    return pCreateMockMake()
      .then((newCarMake) => {
        returnedCarMake = newCarMake;
        return superagent.get(`${apiUrl}/${newCarMake._id}`);
      })
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual(returnedCarMake.name);
        expect(res.body.country).toEqual(returnedCarMake.country);
      })
      .catch((err) => {
        throw err;
      });
  });
});

// describe('PUT request to /api/make', () => {
//   test('200 PUT for successful update to a resource', () => {
//     return pCreateMockMake()
//       .then((newCarMake) => {
//         return superagent.put(`${apiUrl}/${newCarMake._id}`)
//           .send({ name: 'updated name', country: 'updated country' })
//           .then((response) => {
//             expect(response.status).toEqual(200);
//             expect(response.body.name).toEqual('updated name');
//             expect(response.body.country).toEqual('updated country');  
//             // expect(response.body._id.toString()).toEqual(mockData._id.toString());              
//           })
//           .catch((err) => {
//             throw err;
//           });
//       })
//       .catch((err) => {
//         throw err;
//       });
//   });

//   test('404 PUT: No car with this ID', () => {
//     return pCreateMockMake()
//       .then(() => {
//         return superagent.put(`${apiUrl}/12343452`)
//           .catch((err) => {
//             expect(err.status).toEqual(404);
//           });
//       });
//   });

//   test('400 PUT: No path', () => {
//     return superagent.put(`${apiUrl}`)
//       .then((response) => {
//         throw response;
//       })
//       .catch((err) => {
//         expect(err.status).toEqual(400);
//       });
//   });
// });
