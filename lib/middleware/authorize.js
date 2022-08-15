module.exports = async (req, res, next) => {
  try {
    if (req.user.email !== 'admin')
      throw new Error('You do not have access to this page');
    next();
  } catch (e) {
    e.status = 403;
    next(e);
  }
};
