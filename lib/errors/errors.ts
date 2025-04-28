type ErrorName =
  | "NotFound"
  | "Unauthorized"
  | "Forbidden"
  | "InternalServerError"
  | "BadRequest"
  | "ValidationError"
  | "NotImplemented";

export class ServerError extends Error {
  name: ErrorName;
  message: string;
  cause: any;

  constructor(name: ErrorName, message: string, cause?: any) {
    super(message);
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export class UnauthorizedError extends ServerError {
  constructor(message?: string, cause?: any) {
    super(
      "Unauthorized",
      message ?? "Unauthorized request. Have you logged in?",
      cause
    );
  }
}

export class BadRequestError extends ServerError {
  constructor(message?: string, cause?: any) {
    super("BadRequest", message ?? "Bad request. Check all fields.", cause);
  }
}
