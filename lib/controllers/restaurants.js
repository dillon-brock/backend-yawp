const { Router } = require('express');
const Restaurant = require('../models/Restaurant');
const authenticate = require('../middleware/authenticate');
const Review = require('../models/Review');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const restaurants = await Restaurant.getAll();
      res.json(restaurants);
    } catch (e) {
      next(e);
    }
  })
  .get('/search', async (req, res, next) => {
    try {
      let results;
      if (req.query.name) {
        results = await Restaurant.searchByName(req.query.name);
      }
      if (req.query.cuisine) {
        results = await Restaurant.searchByCuisine(req.query.cuisine);
      }
      res.json(results);
    } catch (e) {
      next(e);
    }
  })
  .get('/:restId', async (req, res, next) => {
    try {
      const restaurant = await Restaurant.getById(req.params.restId);
      restaurant.reviews = (await restaurant.getReviews()) ?? [];
      res.json(restaurant);
    } catch (e) {
      next(e);
    }
  })
  .post('/:restId/reviews', authenticate, async (req, res, next) => {
    try {
      const data = {
        ...req.body,
        user_id: req.user.id,
        restaurant_id: req.params.restId,
      };
      const newReview = await Review.insert(data);
      res.json(newReview);
    } catch (e) {
      next(e);
    }
  });
