import express from "express";
import {
  getCoupons,
  getCouponByCode,
  createCoupon,
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);
router.route("/:id").get(protect, getCouponByCode);

export default router;
