const { Router } = require('express');
const { createShortUrl, redirectToUrl, getUserUrls } = require('../controllers/url.controller');
const verifyAuth = require('../middlewares/verifyAuth');

const router = Router();

router.route('/create').post(verifyAuth, createShortUrl);
router.route('/userUrls').post(verifyAuth, getUserUrls);
router.route('/:key').get(redirectToUrl);

module.exports = router;