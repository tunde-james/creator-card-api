const {throwAppError} = require('@app-core/errors');

function throwBusinessError(message, code, statusCode=400) {
  const error = new Error(message);
  error.isApplicationError = true;
  error.errorCode = code;
  error._customStatusCode  = statusCode;
  throw error;
}

module.exports = throwBusinessError;