const HttpStatus = require("../constants/httpStatus");

class CustomError extends Error {
  public name: string;
  public statusCode: number;
  public data: any;

  constructor({
    message,
    name,
    statusCode,
    data,
  }: {
    message: string;
    name: string;
    statusCode: number;
    data?: any;
  }) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.data = data;
    Error.captureStackTrace(this, CustomError);
  }
}
class CustomBadRequest extends CustomError {
  constructor(message = "Bad request", data?: any) {
    super({
      message,
      name: "HttpBadRequest",
      statusCode: HttpStatus.BAD_REQUEST,
      data,
    });
  }
}

class CustomNotFound extends CustomError {
  constructor(message = "Not Found", data?: any) {
    super({
      message,
      name: "HttpNotFound",
      statusCode: HttpStatus.NOT_FOUND,
      data,
    });
  }
}

class CustomInternalServerError extends CustomError {
  constructor(message = "Internal server error", data?: any) {
    super({
      message,
      name: "HttpInternalServerError",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      data,
    });
  }
}

class CustomMultiStatus extends CustomError {
  constructor(message = "Multi-Status", data?: any) {
    super({
      message,
      name: "HttpMultiStatus",
      statusCode: HttpStatus.MULTI_STATUS,
      data,
    });
  }
}
module.exports = {
  CustomError,
  CustomBadRequest,
  CustomNotFound,
  CustomInternalServerError,
  CustomMultiStatus,
};
