const { Router } = require('express');
const { register, login, verifyUser, logout } = require('../controllers/user.controller');
const rateLimiter = require('../middlewares/rateLimiter');
const verifyAuth = require('../middlewares/verifyAuth');

const router = Router();

router.route('/register').post(register);
router.route('/login').post(rateLimiter ,login);
router.route('/verify').get(verifyUser);
router.route('/logout').get(verifyAuth, logout);

module.exports = router;