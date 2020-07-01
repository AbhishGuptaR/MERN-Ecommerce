//Since there are 2 exports in order model
const { Order, ProductCart } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, Order) => {
      if (err) {
        return res.status(400).json({
          error: "Order not found in DB.",
        });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.orderDetails.user = req.profile;
  const order = new Order(req.body.orderDetails);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to save order.",
      });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name ")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({
          error: "No order not found in DB",
        });
      }
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(Order.schema.path("status").enumValues);
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Status Update Failed.",
        });
      }
      res.json(order);
    }
  );
};
