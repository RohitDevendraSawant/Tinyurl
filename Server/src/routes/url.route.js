const { Router } = require('express');
const { createShortUrl, redirectToUrl, getUserUrls, deleteUrl } = require('../controllers/url.controller');
const verifyAuth = require('../middlewares/verifyAuth');

const router = Router();

router.route('/create').post(verifyAuth, createShortUrl);
router.route('/userUrls').post(verifyAuth, getUserUrls);
router.route('/:key').get(redirectToUrl);
router.route("/delete/:urlId").get(verifyAuth, deleteUrl);

module.exports = router;