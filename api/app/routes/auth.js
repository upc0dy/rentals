const express = require('express');
const { socialAuth } = require('../middlewares/auth');
const validate = require('../validation');
const validation = require('../validation/auth');
const action = require('../actions/auth');

const router = express.Router();

router.param('token', action.load);

router.route('/login').get(validate(validation.login), action.login);
router.route('/register').post(validate(validation.register), action.register);
router.route('/verify/:token').get(validate(validation.verify), action.verify);
router
  .route('/facebook')
  .get(
    validate(validation.socialAuth),
    socialAuth('facebook'),
    action.socialLogin,
  );
router
  .route('/google')
  .get(
    validate(validation.socialAuth),
    socialAuth('google'),
    action.socialLogin,
  );

module.exports = router;
