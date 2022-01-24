import asyncHandler from "express-async-handler";
import Coupon from "../models/couponModel.js";

// @desc    Fetch all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  res.json(coupons);
});

// @desc    Fetch single coupon
// @route   GET /api/coupons/:id
// @access  Private
const getCouponByCode = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (coupon) {
    res.json(coupon);
  } else {
    res.status(404);
    throw new Error("Coupon not found");
  }
});

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = new Coupon({
    user: req.user._id,
    code: "Dummy Code",
    discount: 10,
  });

  const createdCoupon = await coupon.save();
  res.status(201).json(createdCoupon);
});

export { getCoupons, getCouponByCode, createCoupon };