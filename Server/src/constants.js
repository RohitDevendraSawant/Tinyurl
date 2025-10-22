const DB_NAME = 'tinyurl';

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
}

const loginRateLimitter = {
    window: 600, // in secs
    limit: 5
}

module.exports = {
    DB_NAME,
    cookieOptions,
    loginRateLimitter,
};