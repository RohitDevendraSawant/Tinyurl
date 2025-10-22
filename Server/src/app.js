const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', require('./routes/user.router'));
app.use('/api/url', require('./routes/url.route'));
app.use('/api', require('./routes/url.route'));

app.use(require('./middlewares/ErrorHandler'));

module.exports = app;