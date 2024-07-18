import express from "express";
import {
  loginUserHandler,
  registerUserHandler,
  logOutUserHandler,
  refreshAccessTokenHandler,
  resetUserPassword,
  verifyUserEmailWithMagicLink,
} from "../../controllers/auth/auth.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = express.Router();

// sample auth routes

router.route("/refresh").post(refreshAccessTokenHandler); // refresh access token
router.route("/register").post(registerUserHandler); // create a new user
router.route("/login").post(loginUserHandler); // login a user
router.route("/logout").post(protect, logOutUserHandler); // log out a user
router.route("/resetpassword").patch(protect, resetUserPassword); // reset users passwords
// verify a users email address by sending a magic link to their email address
router.route("/verify-email").post(protect, verifyUserEmailWithMagicLink);

export default router;
