import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../types";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        name: string;
        // Other user properties
      };
    }
  }
}

export async function protect(req: Request, res: Response, next: NextFunction) {
  // Read JWT from the 'jwt' cookie
  const access_token = req.headers.authorization?.split(" ")[1];

  // Check if we have access token and JWT_SECRET
  if (!access_token?.toString().trim() || !process.env.JWT_SECRET) {
    return res.status(401).json({ message: "Token or Secret Not Found!" });
  }

  try {
    // ********* check if the token is expired or will expire in ! mins time
    // Verify token
    const decodedToken = jwt.verify(
      access_token,
      process.env.JWT_SECRET
    ) as DecodedToken;

    // If the token is expired  return a 401 status response
    if (decodedToken) {
      // set req.user from the token
      req.user = decodedToken;
    } else {
      return res
        .status(401)
        .json({ message: "Token Expired! Refresh It", isExpired: true });
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
