function throwBusinessError(message, customCode, customStatusCode = 400) {
  const error = new Error(message);
  error.isApplicationError = true;
  error.customCode = customCode;
  error.customStatusCode = customStatusCode;
  throw error;
}

module.exports = throwBusinessError;
