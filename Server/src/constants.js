const DB_NAME = 'tinyurl';

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
}

module.exports = {
    DB_NAME,
    cookieOptions,
};