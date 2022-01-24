import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Table, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listCoupons,
  createCoupon,
  deleteCoupon,
} from "../actions/couponActions";
import { COUPON_CREATE_RESET } from "../constants/couponConstants";

const CouponListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const couponList = useSelector(state => state.couponList);
  const { loading, error, coupons } = couponList;

  const couponDelete = useSelector(state => state.couponDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = couponDelete;

  const couponCreate = useSelector(state => state.couponCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    coupon: createdCoupon,
  } = couponCreate;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: COUPON_CREATE_RESET });

    if (!userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/coupon/${createdCoupon._id}/edit`);
    } else {
      dispatch(listCoupons());
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    successDelete,
    successCreate,
    createdCoupon,
  ]);

  const deleteHandler = id => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteCoupon(id));
    }
  };

  const createCouponHandler = () => {
    dispatch(createCoupon());
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Coupons</h1>
        </Col>
        <Col className="text-end">
          <Button className="my-3" onClick={createCouponHandler}>
            <i className="fas fa-plus"></i> Create Coupons
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>CODE</th>
                <th>DISCOUNT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(coupon => (
                <tr key={coupon._id}>
                  <td>{coupon._id}</td>
                  <td>{coupon.code}</td>
                  <td>{coupon.discount}</td>
                  <td>
                    <LinkContainer to={`/admin/coupon/${coupon._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(coupon._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default CouponListScreen;
