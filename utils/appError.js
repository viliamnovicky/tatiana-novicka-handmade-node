class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // message is property of Error class - AppError class extends Error class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
