import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CookieOptions, Request, NextFunction, Response } from "express";
import { DecodedToken } from "../../types";
import { validateForm } from "../../utils/contants";
import crypto from "crypto";
import { prisma } from "../../config/db";

interface LoginRequestBody extends Request {
  email: string;
  hash_pass: string;
}

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true, // Use secure cookies in production
  sameSite: "strict", // Prevent CSRF attacks
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
};

// @desc    register a user
// @route   POST /api/users
export async function registerUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, name, hash_pass: password } = req.body;

  const errorMessage = await validateForm(name, email, password);

  // return any errors after validation
  if (errorMessage) {
    return res.status(400).json(errorMessage);
  }

  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
    return res.status(400).json({
      message:
        "JWT_SECRET or JWT_SECRET_REFRESH is not defined in the env variables.",
    });
  }

  // check if user already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ message: "User already exists! Please Login" });
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //
  if (hashedPassword) {
    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
        },
      });
      if (newUser) {
        // you can also send an email here to notify of the new user created
        
        // verify user email using an OTP or magic link
        return res.status(201).json({
          message: "User Successfully created!",
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
        });
      }
    } catch (error) {
      console.error(error);
      next(error); // Forward the error to the error handling middleware
    }
  }
}
// @desc    Get a user
// @route   GET /api/users/ id
export async function loginUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, hash_pass }: LoginRequestBody = req.body;
  // const { id, email } = req.user;

  if (!email?.toString().trim() || !hash_pass?.toString().trim()) {
    return res.status(400).json({ message: "Email or password not found!" });
  }

  try {
    // get user email by email
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        hashedPassword: true,
        name: true,
        email: true,
        image: true,
        userIsApproved: true,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, Please create an account !" });
    }

    // check user hashedPassword is correct
    if (await bcrypt.compare(hash_pass, user.hashedPassword)) {
      // Generate tokens
      const { accessToken, refreshToken } = await generateTokens(user);
      // Set a cookie named "exampleCookie" with value "cookieValue"

      return res
        .status(200)
        .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
        .json({
          id: user.id,
          refreshToken,
          accessToken,
        });
    } else {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// @desc    Get a user
// @route   GET /api/users/ id
export async function refreshAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refresh_token = req.cookies.refresh_token;

  // Check if we have access token and JWT_SECRET
  if (!refresh_token || !process.env.JWT_SECRET_REFRESH) {
    return res.status(401).json({ message: "Token or Secret Not Found!" });
  }

  try {
    // Verify refresh token
    const decodedToken = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET_REFRESH
    ) as DecodedToken;

    // If the token is expired or will expire soon, return a 401 status response
    if (decodedToken) {
      // Sign new access token
      const { accessToken, refreshToken } = await generateTokens(decodedToken);

      // 4. Add Cookies and return res
      // token rotation - issue new refresh token for all new access token request
      return res
        .status(200)
        .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
        .json({
          accessToken,
          message: "New Token Issued!",
        });
    } else {
      return res
        .status(401)
        .json({ message: "Token Expired! Please Login!", isExpired: true });
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// @desc    log user out
// @route   GET /api/auth/logout
export async function logOutUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // get user from middleware req
  const user = req.user;
  if (!user) {
    return res.status(200).json({ message: "User Not found!" });
  }

  try {
    // invalidate access/refresh token
    return res
      .status(200)
      .clearCookie("refresh_token")
      .json({ message: "Successfully logged Out!" });
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// @desc   reset password
// @route   GET /api/auth/reset_password
export async function resetUserPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password, reset_code } = req.body;
  // get user from middleware req
  const { id } = req.user;

  try {
    // reset user password here***
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// @desc   verify email with magic link
// @route   GET /api/auth/verify-email
export async function verifyUserEmailWithMagicLink(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get user based on POSTed email
    const { email } = req.body;
    // send email here
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// ***************************************************************************************
// Generate JWT
const generateTokens = (user: DecodedToken) => {
  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
    throw new Error(
      "JWT_SECRET or JWT_SECRET_REFRESH is not defined in the environment variables."
    );
  }

  // Generate access token
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      userIsApproved: user.userIsApproved,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_REFRESH,
    { expiresIn: "30d" }
  );

  return {
    accessToken,
    refreshToken,
  };
};
