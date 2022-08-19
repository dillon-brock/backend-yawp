const { Router } = require('express');
const User = require('../models/User');
const {
  exchangeCodeForToken,
  getGoogleProfile,
} = require('../services/google_service');
const jwt = require('jsonwebtoken');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GGL_CLIENT_ID}&scope=${process.env.GGL_SCOPE}&redirect_uri=${process.env.GGL_REDIRECT_URI}&response_type=code`
    );
  })
  .get('/callback', async (req, res, next) => {
    try {
      const { code } = req.query;
      const token = await exchangeCodeForToken(code);
      const googleProfile = await getGoogleProfile(token);
      let user = await User.getByEmail(googleProfile.email);

      if (!user) {
        user = await User.insertGoogleProfile({
          firstName: googleProfile.given_name,
          lastName: googleProfile.family_name,
          email: googleProfile.email,
        });
      }

      const payload = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });

      res
        .cookie(process.env.COOKIE_NAME, payload, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .redirect('/api/v1/restaurants');
    } catch (e) {
      next(e);
    }
  });
