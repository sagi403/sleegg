import {
  COUPON_LIST_FAIL,
  COUPON_LIST_REQUEST,
  COUPON_LIST_SUCCESS,
} from "../constants/couponConstants";

export const couponListReducer = (state = { coupons: [] }, action) => {
  switch (action.type) {
    case COUPON_LIST_REQUEST:
      return {
        loading: true,
      };
    case COUPON_LIST_SUCCESS:
      return {
        loading: false,
        coupons: action.payload,
      };
    case COUPON_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
