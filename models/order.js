const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    ghnID: {
      type: "String",
      default: "Not Processed",
    },
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        count: Number,
        size: String,
      },
    ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Completed",
        "Cash On Delivery",
      ],
    },
    orderedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
