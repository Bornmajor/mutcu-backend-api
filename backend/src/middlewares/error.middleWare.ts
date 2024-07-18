import { Request, Response, NextFunction } from "express";

// Define types for the function parameters and return value
interface CustomError extends Error {
  status?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Resource Not Found, ${req.originalUrl} `);
  res.status(404);
  next(error);
};

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
  next({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
