const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { ALLOWED_ORIGIN } = require('./constants');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: ALLOWED_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/healthy', (req, res) => {
    res.status(200).json({success: true});
});
app.use('/api/user', require('./routes/user.router'));
app.use('/api/url', require('./routes/url.route'));
app.use('/api', require('./routes/url.route'));

app.use(require('./middlewares/ErrorHandler'));

module.exports = app;