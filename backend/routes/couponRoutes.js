import express from "express";
import {
  getCoupons,
  getCouponByCode,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);
router
  .route("/:id")
  .get(protect, getCouponByCode)
  .delete(protect, admin, deleteCoupon)
  .put(protect, admin, updateCoupon);

export default router;
