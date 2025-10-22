const { Router } = require('express');
const { register, login } = require('../controllers/user.controller');
const rateLimiter = require('../middlewares/rateLimiter');

const router = Router();

router.route('/register').post(register);
router.route('/login').post(rateLimiter ,login);

module.exports = router;