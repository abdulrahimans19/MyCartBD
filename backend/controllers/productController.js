const ProductModel = require("../models/ProductModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getProducts = async (req, res, next) => {
  const resPage = 2;
  const apiFeatures = new APIFeatures(ProductModel.find(), req.query)
    .search()
    .filter(resPage);
  const products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};
exports.newProduct = async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await ProductModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
};
exports.getSingleProduct = async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  res.status(201).json({
    success: true,
    product,
  });
};

exports.updateProduct = async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  const products = await ProductModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    products,
  });
};
exports.deleteProduct = async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  const products = await ProductModel.findByIdAndRemove(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    products,
  });
};
//review
exports.createReview = async (req, res, next) => {
  const { productId, rating, comment } = req.body;
  const review = {
    user: req.user.id,
    rating,
    comment,
  };
  const product = await ProductModel.findById(productId);
  const isReviewed = product.reviews.find((review) => {
    review.user.toString() == req.user.id.toString();
  });
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.if.toString) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;
  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
};
exports.getReviews = async (req, res, next) => {
  const product = await ProductModel.findById(req.query.id);
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
};
exports.deleteReview = async (req, res, next) => {
  const product = await ProductModel.findById(req.query.productId);
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  const numOfReview = reviews.length;
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;
  await ProductModel.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReview,
    ratings,
  });
  res.status(200).json({
    success: true,
  });
};
