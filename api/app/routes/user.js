const express = require('express');
const { authorize, ADMIN } = require('../middlewares/auth');
const validate = require('../validation');
const upload = require('../middlewares/upload');
const validation = require('../validation/user');
const action = require('../actions/user');

const router = express.Router();

router
  .route('/invite')
  .get(authorize([ADMIN]), validate(validation.invite), action.inviteUser);

router.route('/upload').put(authorize(), upload, action.uploadAvatar);

module.exports = router;
