const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  shippingInFo: {
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: true,
    },
    mobNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "product",
      },
    },
  ],
  itemPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  paidAt: {
    type: Date,
  },
  deliverAt: {
    type: Date,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
