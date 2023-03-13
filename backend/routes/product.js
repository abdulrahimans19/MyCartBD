const express = require("express");
const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getReviews,
  deleteReview,
} = require("../controllers/productController");
const router = express.Router();
const {
  isAuthenticatedUser,
  autorizeRoles,
} = require("../middleware/authenticate");

router.route("/products").get(isAuthenticatedUser, getProducts);
router
  .route("/product/:id")
  .get(getSingleProduct)
  .put(updateProduct)
  .delete(deleteProduct);
router
  .route("/review")
  .put(isAuthenticatedUser, createReview)
  .get(isAuthenticatedUser, getReviews)
  .delete(deleteReview);
//admin
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, autorizeRoles("admin"), newProduct);

module.exports = router;
