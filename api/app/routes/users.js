const express = require('express');
const { authorize, ADMIN } = require('../middlewares/auth');
const validate = require('../validation');
const validation = require('../validation/user');
const action = require('../actions/user');

const router = express.Router();

router.param('userId', action.load);

router
  .route('/')
  .get(authorize([ADMIN]), action.readUsers)
  .post(authorize([ADMIN]), validate(validation.create), action.createUser);

router
  .route('/:userId')
  .put(authorize([ADMIN]), validate(validation.replace), action.updateUser)
  .patch(authorize([ADMIN]), validate(validation.update), action.updateUser)
  .delete(authorize([ADMIN]), validate(validation.delete), action.deleteUser);

module.exports = router;
