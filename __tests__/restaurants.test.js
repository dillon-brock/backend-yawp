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

const adminUser = {
  firstName: 'In',
  lastName: 'Charge',
  email: 'admin',
  password: 'topbrass',
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
    const res = await agent.post('/api/v1/restaurants/4/reviews').send(review);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      restaurantId: '4',
      userId: expect.any(String),
      ...review,
    });
  });
  it('should give a 401 error if non-authenticated user tries to post review', async () => {
    const review = {
      stars: 4,
      description: 'this will not be posted',
    };
    const res = await request(app)
      .post('/api/v1/restaurants/3/reviews')
      .send(review);
    expect(res.status).toBe(401);
  });
  it('should delete a review if user is admin', async () => {
    await agent.post('/api/v1/users').send(adminUser);
    const res = await agent.delete('/api/v1/reviews/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      stars: 5,
      description: 'Best burrito ever!!',
      userId: '1',
      restaurantId: '1',
    });
  });

  it('should delete a review if user is the one who created the review', async () => {
    const review = {
      stars: 1,
      description: 'There were no burgers on the menu',
    };
    await agent.post('/api/v1/users').send(bob);
    const postedReview = await agent
      .post('/api/v1/restaurants/2/reviews')
      .send(review);
    const res = await agent.delete(`/api/v1/reviews/${postedReview.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      stars: 1,
      description: 'There were no burgers on the menu',
      restaurantId: '2',
      userId: expect.any(String),
    });
  });

  it('should give a 403 error if a non-admin user tries to delete a review they did not create', async () => {
    await agent.post('/api/v1/users').send(bob);
    const res = await agent.delete('/api/v1/reviews/2');
    expect(res.status).toBe(403);
  });
  it('should give a 401 error if a non-authenticated user tries to delete a review', async () => {
    const res = await request(app).delete('/api/v1/reviews/3');
    expect(res.status).toBe(401);
  });
  it('should return restaurants with cuisine specified in search parameters', async () => {
    const res = await request(app).get(
      '/api/v1/restaurants/search?cuisine=mexican'
    );
    expect(res.status).toBe(200);
    expect(res.body[0]).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      cuisine: 'Mexican',
      city: expect.any(String),
    });
  });
  it('should return restaurants with a name specified in search parameters', async () => {
    const res = await request(app).get('/api/v1/restaurants/search?name=green');
    expect(res.status).toBe(200);
    expect(res.body[0]).toEqual({
      id: '2',
      name: 'Green Elephant',
      cuisine: 'Thai',
      city: 'Portland, ME',
    });
  });
  afterAll(() => {
    pool.end();
  });
});
