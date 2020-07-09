const express = require('express');
const { authorize, CLIENT, REALTOR, ADMIN } = require('../middlewares/auth');
const validate = require('../validation');
const validation = require('../validation/apart');
const action = require('../actions/apart');

const router = express.Router();

router.param('apartId', action.load);

router
  .route('/')
  .get(
    authorize([CLIENT, REALTOR, ADMIN]),
    validate(validation.read),
    action.readAparts,
  )
  .post(
    authorize([REALTOR, ADMIN]),
    validate(validation.create),
    action.createApart,
  );

router
  .route('/:apartId')
  .put(
    authorize([REALTOR, ADMIN]),
    validate(validation.replace),
    action.updateApart,
  )
  .patch(
    authorize([REALTOR, ADMIN]),
    validate(validation.update),
    action.updateApart,
  )
  .delete(
    authorize([REALTOR, ADMIN]),
    validate(validation.delete),
    action.deleteApart,
  );

module.exports = router;
