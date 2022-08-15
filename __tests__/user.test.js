const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const agent = request.agent(app);

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should create a new user', async () => {
    const newUser = {
      firstName: 'New',
      lastName: 'Account',
      email: 'newuser@email.com',
      password: 'password',
    };
    const res = await request(app).post('/api/v1/users').send(newUser);
    const { firstName, lastName, email } = newUser;

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
      message: 'Signed in successfully!',
    });
  });

  it('should sign in a user', async () => {
    const bob = {
      firstName: 'Bob',
      lastName: 'Belcher',
      email: 'bobsburgers@email.com',
      password: 'newbaconings',
    };

    await agent.post('/api/v1/users').send(bob);
    const res = await agent.post('/api/v1/users/sessions').send(bob);

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Signed in successfully!');
  });

  it('should get list of users if user is admin', async () => {
    const adminUser = {
      firstName: 'In',
      lastName: 'Charge',
      email: 'admin',
      password: 'topbrass',
    };

    await agent.post('/api/v1/users').send(adminUser);
    const res = await agent.get('/api/v1/users');
    expect(res.status).toBe(200);
    expect(res.body[0]).toEqual({
      id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
