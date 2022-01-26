import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
import Loader from "../components/Loader";
import { listCouponDetails } from "../actions/couponActions";
import { ORDER_CREATE_RESET } from "../constants/orderConstants";

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart);

  const [code, setCode] = useState("");
  const [couponCheck, setCouponCheck] = useState(false);
  const [couponFound, setCouponFound] = useState(false);
  const [message, setMessage] = useState(
    "You can only enter one coupon at a time"
  );

  // Calculate items price
  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);

  // Calculate shipping price
  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);

  // Calculate tax price
  cart.taxPrice = (0.15 * cart.itemsPrice).toFixed(2);

  // Calculate total price
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const [cartItemsPrice, setCartItemsPrice] = useState(+cart.itemsPrice);
  const [cartTotalPrice, setCartTotalPrice] = useState(+cart.totalPrice);
  const itemsPriceBeforeCoupon = +cart.itemsPrice;
  const totalPriceBeforeCoupon = +cart.totalPrice;

  const orderCreate = useSelector(state => state.orderCreate);
  const { order, success, error } = orderCreate;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const couponDetails = useSelector(state => state.couponDetails);
  const { loading: loadingCoupon, error: errorCoupon, coupon } = couponDetails;

  useEffect(() => {
    if (userInfo) {
      dispatch({ type: ORDER_CREATE_RESET });
      if (success) {
        navigate(`/order/${order._id}`);
      } else {
        if (couponCheck) {
          if (Object.keys(coupon).length !== 0) {
            setCouponFound(true);
            setMessage("");

            cart.itemsPrice = Number(
              cart.itemsPrice * (1 - coupon[0].discount / 100)
            ).toFixed(2);
            setCartItemsPrice(+cart.itemsPrice);

            cart.totalPrice = (
              Number(cart.itemsPrice) +
              Number(cart.shippingPrice) +
              Number(cart.taxPrice)
            ).toFixed(2);
            setCartTotalPrice(+cart.totalPrice);
          } else {
            setCouponFound(false);
            setMessage("Coupon not found");
          }
        }
      }
    } else {
      navigate("/login");
    }
  }, [
    dispatch,
    navigate,
    userInfo,
    cart,
    success,
    order,
    coupon,
    couponCheck,
    cartItemsPrice,
    cartTotalPrice,
  ]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cartItemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cartTotalPrice,
      })
    );
  };

  const checkCouponHandler = () => {
    navigate(`/placeorder/${code}`);
    dispatch(listCouponDetails(code));
    setCouponCheck(true);
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          ${item.price} x {item.qty} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  {itemsPriceBeforeCoupon !== cartItemsPrice ? (
                    <Col>
                      <strike>${itemsPriceBeforeCoupon}</strike> $
                      {cartItemsPrice}
                    </Col>
                  ) : (
                    <Col>${cartItemsPrice}</Col>
                  )}
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  {totalPriceBeforeCoupon !== cartTotalPrice ? (
                    <Col>
                      <strike>${totalPriceBeforeCoupon}</strike> $
                      {cartTotalPrice}
                    </Col>
                  ) : (
                    <Col>${cartTotalPrice}</Col>
                  )}
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="w-100"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row className="mb-3">
                  <Col>
                    <Form.Label>Coupon Code</Form.Label>
                  </Col>
                </Row>

                {loadingCoupon && <Loader />}
                {errorCoupon && (
                  <Message variant="danger">{errorCoupon}</Message>
                )}
                {couponFound ? (
                  <Form.Text>
                    <h5 className="inline-el">
                      {Object.keys(coupon).length !== 0 && coupon[0].code}
                    </h5>{" "}
                    is applied
                  </Form.Text>
                ) : (
                  ""
                )}

                <Row className="mt-3">
                  <Col md={8}>
                    <Form.Control
                      type="code"
                      placeholder="Enter code"
                      value={code}
                      onChange={e => setCode(e.target.value)}
                    ></Form.Control>
                  </Col>
                  <Col>
                    <Button
                      size="sm"
                      className="mb-3"
                      type="button"
                      disabled={cart.cartItems === 0}
                      onClick={checkCouponHandler}
                      variant="outline-primary"
                    >
                      Check Code
                    </Button>
                  </Col>
                </Row>

                <Form.Text
                  className={
                    message === "Coupon not found" && !couponFound
                      ? "coupon-message"
                      : ""
                  }
                >
                  {!couponFound && message}
                </Form.Text>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
