import React, { useState, useEffect } from "react";
import { API } from "../backend.js";
import Base from "./Base.js";
import Card from "./Card.js";
import { getProducts } from "./helper/coreapicalls.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const loadAllProducts = () => {
    getProducts().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  return (
    <Base title="Home Page" description="Welcome to the T-shirt Store.">
      <div className="row text-center">
        <h1 className="text-white">T-Shirts</h1>
        <div className="row">
          {products.map((products, index) => {
            return (
              <div key={index} className="col-4 mb-4">
                <Card product={products} />
              </div>
            );
          })}
        </div>
      </div>
    </Base>
  );
};

export default Home;
