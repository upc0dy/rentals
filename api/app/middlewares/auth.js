const httpStatus = require('http-status');
const passport = require('passport');
const User = require('../models/user');
const ApiError = require('../models/error');

const CLIENT = 1;
const REALTOR = 2;
const ADMIN = 3;

const handleJWT = (req, res, next, roles) => async (err, user) => {
  const apiError = new ApiError({
    message: err ? err.message : 'Unauthorized request',
    status: httpStatus.UNAUTHORIZED,
  });
  if (err || !user) {
    next(apiError);
    return;
  }
  try {
    const reqUser = await User.findById(user._id);
    if (!roles.includes(reqUser.role)) {
      apiError.status = httpStatus.FORBIDDEN;
      apiError.message = 'Permission denied';
      next(apiError);
    } else if (!reqUser.approved) {
      apiError.message = 'Your account has not been approved yet';
      next(apiError);
    } else {
      req.user = reqUser;
      next();
    }
  } catch ({ message }) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message });
  }
};

module.exports = {
  CLIENT,
  REALTOR,
  ADMIN,
  authorize: (roles = [CLIENT, REALTOR, ADMIN]) => (req, res, next) =>
    passport.authenticate(
      'jwt',
      { session: false },
      handleJWT(req, res, next, roles),
    )(req, res, next),
  socialAuth: socialType =>
    passport.authenticate(socialType, { session: false }),
};
