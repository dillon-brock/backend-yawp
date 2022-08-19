const Review = require('../models/Review');

module.exports = async (req, res, next) => {
  try {
    if (req.method === 'DELETE') {
      const review = await Review.getById(req.params.id);
      if (req.user.email !== 'admin' && req.user.id !== review.userId) {
        throw new Error('You do not have access to delete this review');
      }
    } else {
      if (req.user.email !== 'admin')
        throw new Error('You do not have access to this page');
    }
  } catch (e) {
    e.status = 403;
    next(e);
  }
  next();
};
