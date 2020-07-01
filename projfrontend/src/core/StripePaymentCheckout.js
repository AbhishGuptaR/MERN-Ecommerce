import React, { useState, useEffect } from "react";
import { isAuthenticated } from "../auth/helper";
import { clearCart, loadCart } from "./helper/carthelper";
import { Link } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "./helper/orderhelper";

const StripePaymentCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setDate] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalPrice = () => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    return fetch(`${API}stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("RESPONSE: ", response);
        const { status } = response;
        console.log("STATUS:", status);
        //Clear cart
        clearCart(() => {
          console.log("CART CLEARED");
        });
        //FORCE RELOAD
        setReload(!reload);
      })
      .catch((err) => console.log(err));
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckout
        stripeKey="pk_test_51GziFMDzexeujdHFoNwfK2DT2bhW2FSLWUIyehciyjY68Q5npCoI7PY99UoknHtMjUwBkXA4rqYob5Hwm0vRNKir00cSu5L90S"
        token={makePayment}
        amount={getFinalPrice() * 100}
        name="Buy T-Shirts"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay With Stripe</button>
      </StripeCheckout>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Sign In</button>
      </Link>
    );
  };

  return (
    <div>
      <h1 className="text-white">Stripe Checkout:</h1>
      {showStripeButton()}
    </div>
  );
};

export default StripePaymentCheckout;
