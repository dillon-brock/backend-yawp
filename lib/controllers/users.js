const { Router } = require('express');
const User = require('../models/User');
const UserService = require('../services/UserService');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const [user, token] = await UserService.signUp(req.body);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ ...user, message: 'Signed in successfully!' });
    } catch (e) {
      next(e);
    }
  })
  .get('/profile', [authenticate], async (req, res, next) => {
    try {
      const user = await User.getById(req.user.id);
      user.reviews = (await user.getReviews()) ?? [];
      res.json(user);
    } catch (e) {
      next(e);
    }
  })
  .get('/', [authenticate, authorize], async (req, res, next) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (e) {
      next(e);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const token = await UserService.signIn({ email, password });
      res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully!' });
    } catch (e) {
      next(e);
    }
  });
