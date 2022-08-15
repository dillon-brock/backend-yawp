const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const bob = {
  firstName: 'Bob',
  lastName: 'Belcher',
  email: 'bobsburgers@email.com',
  password: 'newbaconings',
};

const agent = request.agent(app);

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
  it('should add a new review if user is signed in', async () => {
    const review = {
      stars: 1,
      description:
        'I worked here for a year and it was the most misogynistic environment I ever experienced, which is saying something for the Portland food service scene.',
    };
    await agent.post('/api/v1/users').send(bob);
    const res = await agent.post('/api/v1/users/4/reviews').send(review);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      restaurant_id: '4',
      user_id: expect.any(String),
      ...review,
    });
  });
  it('should give a 401 error if non-authenticated user tries to post review', async () => {
    const review = {
      stars: 4,
      description: 'this will not be posted',
    };
    const res = await agent.post('/api/v1/users/3/reviews').send(review);
    expect(res.status).toBe(401);
  });
  afterAll(() => {
    pool.end();
  });
});
