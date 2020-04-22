class CustomError {
  constructor(status, msg) {
      this.statusCode = status;
      this.msg = msg;
  }
}

module.exports = CustomError;
