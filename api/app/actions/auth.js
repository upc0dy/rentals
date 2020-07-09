const httpStatus = require('http-status');
const User = require('../models/user');
const Token = require('../models/token');
const Invite = require('../models/invite');
const EmailHelper = require('./email');

const login = (req, res) => {
  let { email, password } = req.query;

  User.findOne({ email }, async (_, user) => {
    if (user) {
      if (user.blocked) {
        res.status(httpStatus.FORBIDDEN).send({
          message:
            'Your account has been blocked due to frequent login failure. Please wait until it comes back.',
        });
      } else if (!user.password) {
        res.status(httpStatus.BAD_REQUEST).send({
          message: 'You have logged in using social account before.',
        });
      } else if (await user.validPassword(password)) {
        if (user.approved) {
          Object.assign(user, { danger: 0 }).save();
          res.send({
            user: user.extract(),
            token: user.token(),
            accountType: 'jwt',
          });
        } else {
          EmailHelper.verify(email, user._id, (success, message) => {
            if (success) {
              res.status(httpStatus.FORBIDDEN).send({
                error:
                  'Your account has not been approved yet. Please check your inbox for approval instructions.',
              });
            } else {
              res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message });
            }
          });
        }
      } else {
        user.danger = user.danger + 1;
        user.blocked = user.danger >= 3;
        user.save();
        res
          .status(httpStatus.UNAUTHORIZED)
          .send({ message: 'Incorrect password' });
      }
    } else {
      Invite.findOne({ email, registered: false }, (__, doc) => {
        if (doc) {
          res.status(httpStatus.FORBIDDEN).send({
            message:
              'You are just invited to our application. Please follow our registration process below.',
          });
        } else {
          res
            .status(httpStatus.NOT_FOUND)
            .send({ message: `No existing user with ${email}` });
        }
      });
    }
  });
};

const register = (req, res, next) => {
  new User(req.body)
    .save()
    .then(user => {
      const { email } = user;
      Invite.findOne({ email, registered: false }, (_, doc) => {
        if (doc) {
          Invite.findOneAndUpdate({ email }, { registered: true }).exec();
          User.findByIdAndUpdate(user._id, { approved: true }).exec();
          res.send({
            user: { ...user.extract(), approved: true },
            token: user.token(),
            accountType: 'jwt',
          });
        } else {
          EmailHelper.verify(email, user._id, (success, message) => {
            if (success) {
              res.send({
                message:
                  'Registration successfully done. Please wait for verification center to reach out you with further instructions.',
              });
            } else {
              res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message });
            }
          });
        }
      });
    })
    .catch(err => next(User.checkEmail(err, req.body.email)));
};

const load = async (req, _, next, token) => {
  try {
    req.locals = { token: await Token.get(token) };
    next();
  } catch (error) {
    next(error);
  }
};

const verify = (req, res, next) => {
  const { token } = req.locals;

  const user = Object.assign(token.user, { approved: true });
  user
    .save()
    .then(_ => res.send('Your account verified successfully.'))
    .catch(err => next(err));

  token.remove();
};

const socialLogin = (req, res, next) => {
  try {
    const { user } = req;
    const accountType = user.social.includes('gl') ? 'google' : 'facebook';
    return res.send({ user: user.extract(), token: user.token(), accountType });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login, register, load, verify, socialLogin };
