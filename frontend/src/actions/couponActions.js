import axios from "axios";
import {
  COUPON_LIST_FAIL,
  COUPON_LIST_REQUEST,
  COUPON_LIST_SUCCESS,
} from "../constants/couponConstants";

export const listCoupons = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: COUPON_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/coupons`, config);

    dispatch({
      type: COUPON_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
