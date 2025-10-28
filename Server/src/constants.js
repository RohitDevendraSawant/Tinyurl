const DB_NAME = 'tinyurl';

const ALLOWED_ORIGIN= [
  'http://localhost:5173',
]

const isProduction = process.env.ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',  
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 1 // 1D
}

const loginRateLimitter = {
    window: 600, // in secs
    limit: 5
}

module.exports = {
    DB_NAME,
    cookieOptions,
    loginRateLimitter,
    ALLOWED_ORIGIN,
};