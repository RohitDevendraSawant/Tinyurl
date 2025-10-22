const { loginRateLimitter } = require("../constants");
const ApiError = require("../utils/ApiError");

const rateLimiter = async (req, res, next) => {
    try {
        const redisClient = req.app.locals.redisClient;
        
        const { email } = req.body;

        if(!email){
            throw new ApiError(400, "Please provide email");
        }

        const key = `user:${email}`;

        const attempts = await redisClient.incr(key);

        if(attempts === 1){
            redisClient.expiry(loginRateLimitter.window);
        }

        if(attempts > loginRateLimitter.limit){
            const ttl = await redisClient.ttl(key);
            throw new ApiError(
                429, `Too many login attempts. Try again in ${ttl} seconds.`
            );
        }

        next();

    } catch (error) {
        next(error);
    }
}

module.exports = rateLimiter;