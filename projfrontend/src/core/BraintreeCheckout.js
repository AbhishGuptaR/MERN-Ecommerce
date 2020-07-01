import React, { useState, useEffect } from "react";
import DropIn from "braintree-web-drop-in-react";

import { loadCart, clearCart } from "./helper/carthelper";
import { Link } from "react-router-dom";
import { getmeToken, processPayment } from "./helper/braintreehelper";
import { createOrder } from "./helper/orderhelper";
import { isAuthenticated } from "../auth/helper";

const BraintreeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
  });

  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    getmeToken(userId, token).then((info) => {
      //   console.log("INFO: ", info);
      if (info.error) {
        setInfo({ ...info, error: info.error });
      } else {
        const clientToken = info.clientToken;
        setInfo({ clientToken });
      }
    });
  };

  const showBTDropIn = () => {
    return (
      <div>
        {info.clientToken !== null && products.length > 0 ? (
          <div>
            <DropIn
              options={{ authorization: info.clientToken }}
              onInstance={(instance) => (info.instance = instance)}
            />
            <button className="btn btn-block btn-success" onClick={onPurchase}>
              Pay
            </button>
          </div>
        ) : (
          <h3>Please Log in or add something to the cart.</h3>
        )}
      </div>
    );
  };

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const onPurchase = () => {
    setInfo({ ...info, loading: true });
    let nonce;
    let getNonce = info.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount(),
        };
        processPayment(userId, token, paymentData)
          .then((data) => {
            setInfo({ ...info, success: data.success, loading: false });
            console.log("PAY SUCCESS");

            const orderData = {
              products: products,
              transaction_id: data.transaction.id,
              amount: data.transaction.amount,
            };
            // console.log("ID: ", userId);
            // console.log("TOKEN: ", token);
            // console.log("ORDER DATA: ", orderData);
            // console.log("TYPEOF: ", typeof orderData);
            // const oderData = JSON.stringify(orderData);
            // console.log("STRINGED: ", oderData);

            createOrder(userId, token, orderData);

            //Empty the cart.
            clearCart(() => {
              console.log("CART CLEARED");
            });
            //Force Reload
            setReload(!reload);
          })
          .catch((err) => {
            setInfo({ ...info, loading: false, success: false });
            console.log("PAY FAIL");
            console.log(err);
          });
      })
      .catch();
  };

  const getAmount = () => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  return (
    <div>
      <h3>Paypal Checkout:</h3>
      {showBTDropIn()}
    </div>
  );
};

export default BraintreeCheckout;
