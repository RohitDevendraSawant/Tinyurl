const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_VALIDITY });
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_VALIDITY });
}

const getShortUrl = (key) => {
    return `${process.env.BASE_URL}/${key}`;
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    getShortUrl,
};