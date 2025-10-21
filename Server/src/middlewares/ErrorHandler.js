const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

function errorHandler(err, req, res, next) {
  console.error(err);
  
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, err.message, err.errors));
  }

  res
    .status(500)
    .json(new ApiResponse(500, 'Internal Server Error', err.message));
}

module.exports = errorHandler;
