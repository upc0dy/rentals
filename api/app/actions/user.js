const fs = require('fs');
const path = require('path');
const httpStatus = require('http-status');
const User = require('../models/user');
const Apart = require('../models/apart');
const Invite = require('../models/invite');
const EmailHelper = require('./email');

const load = async (req, _, next, id) => {
  try {
    if (id !== 'upload' && id !== 'invite') {
      req.locals = { user: await User.get(id) };
    }
    next();
  } catch (error) {
    next(error);
  }
};

const createUser = (req, res, next) => {
  new User(req.body)
    .save()
    .then(user => {
      EmailHelper.verify(user.email, user._id, (success, message) => {
        if (success) {
          res.status(httpStatus.CREATED).send({ user: user.extract() });
        } else {
          res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message });
        }
      });
    })
    .catch(err => next(User.checkEmail(err, req.body.email)));
};

const readUsers = async (_, res, next) => {
  try {
    const users = await User.find({ role: { $ne: 3 } })
      .sort({ createdAt: -1 })
      .exec();
    res.send({ users: users.map(x => x.extract()) });
  } catch (error) {
    next(error);
  }
};

const updateUser = (req, res, next) => {
  const { user } = req.locals;
  if (user.role === 3) {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Permission denied' });
    return;
  }

  const preUser = Object.assign(user, req.body);
  preUser
    .save()
    .then(savedUser => res.send({ user: savedUser.extract() }))
    .catch(err => next(User.checkEmail(err, req.body.email)));
};

const deleteUser = (req, res, next) => {
  const { user } = req.locals;
  if (user.role === 3) {
    res.status(httpStatus.FORBIDDEN).send({ message: 'Permission denied' });
    return;
  }

  Apart.deleteMany({ realtor: user }).exec();
  user
    .remove()
    .then(_ => {
      if (!user.avatar.includes('default')) {
        fs.unlinkSync(path.join(__dirname, '../../avatars/', user.avatar));
      }
      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(err => next(err));
};

const inviteUser = (req, res, next) => {
  const { email } = req.query;

  User.findOne({ email }, async (_, user) => {
    if (user) {
      res
        .status(httpStatus.CONFLICT)
        .send({ message: `A user existing with ${email}` });
    } else {
      new Invite({ email })
        .save()
        .then(__ => {
          EmailHelper.invite(email, (success, message) => {
            if (success) {
              res.send({
                message: 'An invitation email has been sent successfully.',
              });
            } else {
              res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message });
            }
          });
        })
        .catch(err => next(Invite.checkEmail(err, email)));
    }
  });
};

const uploadAvatar = (req, res, next) => {
  if (!Object.keys(req).includes('file')) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: 'There should be an avatar image attached.' });
    return;
  }

  const { avatar } = req.user;

  const preUser = Object.assign(req.user, { avatar: req.file.filename });
  preUser
    .save()
    .then(user => {
      if (!avatar.includes('default')) {
        fs.unlinkSync(path.join(__dirname, '../../avatars/', avatar));
      }
      res.send({ user: user.extract() });
    })
    .catch(err => {
      fs.unlinkSync(path.join(__dirname, '../../avatars/', preUser.avatar));
      next(err);
    });
};

module.exports = {
  load,
  createUser,
  readUsers,
  updateUser,
  deleteUser,
  inviteUser,
  uploadAvatar,
};
