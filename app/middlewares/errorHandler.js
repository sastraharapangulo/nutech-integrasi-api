import { ResponseError } from "../errors/responseError.js";

const onLost = (req, res) => {
  res.status(404).json({
    status: "FAIL",
    message: "Route not found!",
  });
};

const onError = (err, req, res, next) => {
  console.error("Error caught:", err); // opsional untuk logging
  const isClientError =
    err instanceof ResponseError && err.status >= 400 && err.status < 500;
  const statusCode = isClientError ? err.status : 500;
  let errorResponse;

  if (isClientError) {
    if (err.customResponse) {
      errorResponse = err.customResponse;
    } else {
      errorResponse = { status: statusCode, message: err.message };
    }
  } else {
    errorResponse = {
      status: "ERROR",
      error: {
        name: err.name || "InternalServerError",
        message: err.message || "Something went wrong!",
      },
    };
  }

  res.status(statusCode).json(errorResponse);
};

export { onLost, onError };
