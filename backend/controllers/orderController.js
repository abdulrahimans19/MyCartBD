const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
exports.newOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingInFo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInFo,
  } = req.body;
  const order = await Order.create({
    orderItems,
    shippingInFo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInFo,
    paidAt: Date.now(),
    user: req.user.id,
  });
  res.status(200).json({
    success: true,
    order,
  });
};
exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "users",
    "name email"
  );
  if (!order) {
    return next(
      res.status(400).json({
        success: false,
        message: (`error to get user ${req.params.id}`, 404),
      })
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
};
exports.myOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(200).json({
    success: true,
    orders,
  });
};
//admin
exports.orders = async (req, res, next) => {
  const orders = await Order.find();
  const totalAmount = 0;
  orders.forEach((order) => {
    totalAmount + order.totalPrice;
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
};
exports.updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus == "Delivered") {
    return next(
      res.status(400).json({
        success: false,
        message: ("order already deliverd", 400),
      })
    );
  }
  order.orderItems.forEach(async (orderItem) => {
    await updateStock(orderItem.product, orderItem.quantity);
  });
  order.orderStatus = req.body.orderStatus;
  order.deliverdAt = Date.now();
  await order.save();
  res.status(200).json({
    success: true,
  });
};
async function updateStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}
exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) {
    return next(
      res.status(400).json({
        success: false,
        message: ("no order found", 400),
      })
    );
  }
  res.status(200).json({
    success: true,
  });
};
