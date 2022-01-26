import express from "express";
import {
  getCoupons,
  getCouponByCode,
  createCoupon,
  deleteCoupon,
  updateCoupon,
  getCouponById,
} from "../controllers/couponController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);
router
  .route("/:id")
  .get(protect, admin, getCouponById)
  .delete(protect, admin, deleteCoupon)
  .put(protect, admin, updateCoupon);
router.route("/1/:code").get(protect, getCouponByCode);

export default router;
