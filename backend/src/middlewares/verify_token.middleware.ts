import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../types";

export async function protect_magic_link(
  req: Request<{}, {}, {}, { token: string }>,
  res: Response,
  next: NextFunction
) {
  const { token } = req.query;

  const JWT_VERIFY_RESET_SECRET = process.env.JWT_VERIFY_RESET_SECRET;

  // Check if we have access token and JWT_SECRET
  if (!token?.toString().trim() || !JWT_VERIFY_RESET_SECRET) {
    return res.status(401).json({ message: "Token or Secret Not Found!" });
  }

  try {
    // ********* check if the token is expired or will expire in ! mins time
    const decodedToken = jwt.verify(
      token,
      JWT_VERIFY_RESET_SECRET
    ) as DecodedToken;

    // If the token is expired  return a 401 status response
    if (decodedToken && decodedToken.email) {
      // set req.user from the token
      req.user = decodedToken;
    } else {
      return res.status(401).json({ message: "Invalid Token!" });
    }
    // call subsequent funcs
    next();
  } catch (error) {
    console.log(error);
    res.status(401);
    throw new Error("Not authorized");
  } finally {
  }
}
