import express from "express";
import { handleContactUs } from "../controllers/contact_us.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
// sample route to post contact us information from the contact us form on the UI
router.route("/").post(protect, handleContactUs);

export default router;
