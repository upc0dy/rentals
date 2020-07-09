const Router = require('express').Router;
const ROUTES_AUTH = require('./auth');
const ROUTES_USER = require('./user');
const ROUTES_USERS = require('./users');
const ROUTES_APART = require('./apart');

const router = Router();

router.get('/status', (_, res) => res.send('OK'));
router.use('/auth', ROUTES_AUTH);
router.use('/user', ROUTES_USER);
router.use('/users', ROUTES_USERS);
router.use('/aparts', ROUTES_APART);

module.exports = router;
