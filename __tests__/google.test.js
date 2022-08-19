const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
jest.mock('../lib/services/google_service');

describe('google routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should login and redirect users to /api/v1/restaurants', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/google/callback?code=123')
      .redirects(1);

    expect(res.body[0]).toEqual({
      city: expect.any(String),
      cuisine: expect.any(String),
      id: expect.any(String),
      name: expect.any(String),
    });
  });
});
