import React, { useState, useEffect } from "react";
import { API } from "../backend.js";
import Base from "./Base.js";
import Card from "./Card.js";
import { loadCart } from "./helper/carthelper.js";
import StripePaymentCheckout from "./StripePaymentCheckout.js";
import BraintreeCheckout from "./BraintreeCheckout.js";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>Added Products:</h2>
        {products.map((products, index) => {
          return (
            <Card
              key={index}
              product={products}
              removeFromCart={true}
              addToCart={false}
              setReload={setReload}
              reload={reload}
            />
          );
        })}
      </div>
    );
  };

  const getAmount = () => {
    let amount = 0;
    products.map((product) => {
      amount = amount + product.price;
    });
    return amount;
  };

  const loadCheckout = () => {
    return (
      <div>
        <h3>Payment Section:</h3>
        <br />
        <h4>To Pay: {getAmount()}</h4>
        <br />
        <StripePaymentCheckout products={products} setReload={setReload} />
        <br />
        <BraintreeCheckout products={products} setReload={setReload} />
      </div>
    );
  };

  return (
    <Base title="Cart" description="Ready to checkout">
      <div className="row text-center">
        <div className="col-6">
          {products.length > 0 ? (
            loadAllProducts(products)
          ) : (
            <h3>No Products in cart. Add some from Home.</h3>
          )}
        </div>
        <div className="col-6">{loadCheckout()}</div>
      </div>
    </Base>
  );
};

export default Cart;
