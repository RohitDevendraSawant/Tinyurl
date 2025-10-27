class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 400;
        this.message = message;
        this.data = data;
    }
}

module.exports = ApiResponse;