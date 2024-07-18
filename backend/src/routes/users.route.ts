import express from "express";
import { updateUser } from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// sample route to get and update user profile
router
  .route("/profile/:id")
  // .get(protect, getUserProfileData)
  .patch(protect, updateUser);

export default router;
