const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 50,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      text: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    subs: [
      {
        type: ObjectId,
        ref: "Sub",
      },
    ],
    quantity: Number,
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    // shipping: {
    //   type: String,
    //   enum: ["Yes", "No"],
    // },
    size: {
      type: String,
      enum: [
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "42.5",
        "43",
        "44",
        "40.5",
        "41.5",
        "43.5",
        "36",
      ],
    },
    // sizes: [
    //   {
    //     type: ObjectId,
    //     ref: "Size",
    //   },
    // ],
    brand: {
      type: String,
      enum: [
        "Asics",
        "Bronze 56k",
        "Converse",
        "Vans",
        "Nike",
        "Last Resort AB",
        "Adidas",
        "Etnies",
        "Reebok",
      ],
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
