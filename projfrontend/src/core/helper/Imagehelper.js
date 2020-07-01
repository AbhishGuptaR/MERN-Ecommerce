import React from "react";
import { API } from "../../backend";

const Imagehelper = ({ product }) => {
  const imageURL = product
    ? `${API}product/photo/${product._id}`
    : `https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

  return (
    <div className="rounded border border-success p-2">
      <img
        src={imageURL}
        alt="Sample T-Shirt"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
        className="mb-3 rounded"
      />
    </div>
  );
};

export default Imagehelper;
