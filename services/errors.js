// Define NotFoundError
class NotFoundError extends Error {
    constructor(message = "Not Found", ...params) {
      super(...params);
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, NotFoundError);
      }
  
      this.name = "NotFoundError";
      this.message = message;
      this.date = new Date();
    }
  }
  
  // Define WrongInputError
  class WrongInputError extends Error {
    constructor(message = "Wrong Input", ...params) {
      super(...params);
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, WrongInputError);
      }
  
      this.name = "WrongInputError";
      this.message = message;
      this.date = new Date();
    }
  }
  
  // Define DBRetrievalError
  class DBRetrievalError extends Error {
    constructor(message = "Database Retrieval Error", ...params) {
      super(...params);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, DBRetrievalError);
      }
      this.name = "DBRetrievalError";
      this.message = message;
      this.date = new Date();
    }
  }
  
  class BusinessValidationError extends Error {
    constructor(message = "The system cannot process this request due to business resources.", ...params) {
        super(...params);
        if (Error.captureStackTrace) {
          Error.captureStackTrace(this, BusinessValidationError);
        }
      this.name = "BusinessValidationError";
      this.message = message;
      this.date = new Date();
    }
  }
  module.exports = {
    NotFoundError,
    WrongInputError,
    DBRetrievalError,
    BusinessValidationError
  };
  