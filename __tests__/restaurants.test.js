const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('restaurant and review routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('should return a list of restaurants', async () => {
    const res = await request(app).get('/api/v1/restaurants');
    expect(res.status).toBe(200);
    expect(res.body[0]).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      cuisine: expect.any(String),
      city: expect.any(String),
    });
  });
  it('should return a restaurant with id matching params with nested reviews', async () => {
    const res = await request(app).get('/api/v1/restaurants/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      name: 'El Gallo',
      cuisine: 'Mexican',
      city: 'Portland, OR',
      reviews: expect.any(Array),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
