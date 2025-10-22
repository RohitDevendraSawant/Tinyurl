const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

const verifyAuth = async (req, res, next) => {
    const accessToken = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    try {
        if (!accessToken) {
            throw new ApiError(401, 'Authentication required');
        }

        const decoded = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        
        req.user = {
            _id: decoded.userId,
            email: decoded.email,
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = verifyAuth;