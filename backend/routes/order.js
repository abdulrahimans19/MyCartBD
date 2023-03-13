const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  orders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();
const {
  isAuthenticatedUser,
  autorizeRoles,
} = require("../middleware/authenticate");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/myorders").get(isAuthenticatedUser, myOrders);
//admin
router
  .route("/orders")
  .get(isAuthenticatedUser, autorizeRoles("admin"), orders);
router
  .route("/orders/:id")
  .put(isAuthenticatedUser, autorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, autorizeRoles("admin"), deleteOrder);

module.exports = router;
