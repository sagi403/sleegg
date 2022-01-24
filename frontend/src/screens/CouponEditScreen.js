import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { listCouponDetails, updateCoupon } from "../actions/couponActions";
import { COUPON_UPDATE_RESET } from "../constants/couponConstants";

const CouponEditScreen = () => {
  const params = useParams();

  const couponId = params.id;

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const couponDetails = useSelector(state => state.couponDetails);
  const { loading, error, coupon } = couponDetails;

  const couponUpdate = useSelector(state => state.couponUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = couponUpdate;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (successUpdate) {
        dispatch({ type: COUPON_UPDATE_RESET });
        navigate("/admin/couponlist");
      } else {
        if (!coupon.code || coupon._id !== couponId) {
          dispatch(listCouponDetails(couponId));
        } else {
          setCode(coupon.code);
          setDiscount(coupon.discount);
        }
      }
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, userInfo, coupon, couponId, successUpdate]);

  const submitHandler = e => {
    e.preventDefault();
    dispatch(
      updateCoupon({
        _id: couponId,
        code,
        discount,
      })
    );
  };

  return (
    <>
      <Link to="/admin/couponlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Coupon</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="code" className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={e => setCode(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="discount" className="mb-3">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter discount"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default CouponEditScreen;
