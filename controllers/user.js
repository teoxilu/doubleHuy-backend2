const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const sendConfirmationEmail = require("../controllers/orderController");
const uniqueid = require("uniqueid");

exports.userCart = async (req, res) => {
  // console.log(req.body); // {cart: []}
  const { cart } = req.body;
  try {
    let products = [];
    let outOfStockItems = [];

    const user = await User.findOne({ email: req.user.email }).exec();

    // check if cart with logged in user id already exist
    let cartExistByThisUser = await Cart.findOne({
      orderedBy: user._id,
    }).exec();

    if (cartExistByThisUser) {
      cartExistByThisUser.remove();
      console.log("removed old cart");
    }

    for (let i = 0; i < cart.length; i++) {
      let object = {};

      let productFromDb = await Product.findById(cart[i]._id)
        .select("price quantity")
        .exec();

      // if (productFromDb && productFromDb.quantity <= 0) continue;
      object.product = cart[i]._id;
      object.title = cart[i].title;
      object.count = cart[i].count;
      object.size = cart[i].size;
      object.price = cart[i].price;
      // object.price = productFromDb?.price;
      console.log(object);

      if (productFromDb && productFromDb.quantity >= cart[i].count) {
        products.push(object);
      } else {
        outOfStockItems.push(object);
      }
    }

    if (outOfStockItems.length > 0) {
      return res.status(200).json({
        isSomeItemsOutOfStock: true,
        message: "Some items are out of stock",
        outOfStockItems,
        availableItems: products,
      });
    }

    // console.log('products', products)

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    // console.log("cartTotal", cartTotal);

    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();

    console.log("new cart ----> ", newCart);
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  const { products, cartTotal, totalAfterDiscount } = cart;
  res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
  console.log("empty cart");
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

exports.updateOrder = async (req, res) => {
  const { orderId } = req.params; // Existing orderId from request params
  const { newGhnId } = req.body; // New orderId from request body

  const updatedOrder = await Order.findOneAndUpdate(
    { _id: orderId },
    { ghnID: newGhnId },
    { new: true }
  ).exec();

  res.json({ ok: true, order: updatedOrder });
};

exports.savePhone = async (req, res) => {
  const userPhone = await User.findOneAndUpdate(
    { email: req.user.email },
    { phone: req.body.phone }
  ).exec();

  res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log("COUPON", coupon);

  const validCoupon = await Coupon.findOne({ name: coupon }).exec();
  if (validCoupon === null) {
    return res.json({
      err: "Invalid coupon",
    });
  }

  // Check if the coupon is expired
  if (validCoupon.isExpired()) {
    return res.json({
      err: "Coupon is expired",
    });
  }
  console.log("VALID COUPON", validCoupon);

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price")
    .exec();

  console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

  // calculate the total after discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2); // 99.99

  console.log("----------> ", totalAfterDiscount);

  Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount },
    { new: true }
  ).exec();

  res.json(totalAfterDiscount);
};

exports.checkOrder = async (req, res) => {
  // const { paymentIntent } = req.body.stripeResponse;
  const { cart } = req.body;

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  try {
    let outOfStockItems = [];
    let availableItems = [];

    for (let product of products) {
      const productInDB = await Product.findById(product._id);

      if (productInDB && productInDB.quantity >= item.quantity) {
        availableItems.push(item);
      } else {
        outOfStockItems.push(item);
      }
    }

    if (outOfStockItems.length > 0) {
      return res.status(200).json({
        message: "Some items are out of stock",
        outOfStockItems,
        availableItems,
      });
    }

    let newOrder = await new Order({
      products: availableItems,
      paymentIntent,
      orderedBy: user._id,
    }).save();

    // decrement quantity, increment sold
    let bulkOption = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id }, // IMPORTANT item.product
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

    // await sendConfirmationEmail(user.email, newOrder);

    // console.log("NEW ORDER SAVED", newOrder);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createOrder = async (req, res) => {
  // console.log(req.body);
  // return;
  const { paymentIntent } = req.body.stripeResponse;

  const user = await User.findOne({ email: req.user.email }).exec();

  let { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  try {
    let newOrder = await new Order({
      products,
      paymentIntent,
      orderedBy: user._id,
    }).save();

    // decrement quantity, increment sold
    let bulkOption = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id }, // IMPORTANT item.product
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    let updated = await Product.bulkWrite(bulkOption, {});
    console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

    // await sendConfirmationEmail(user.email, newOrder);

    // console.log("NEW ORDER SAVED", newOrder);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.orders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).exec();

  let userOrders = await Order.find({ orderedBy: user._id })
    .populate("products.product")
    .exec();

  res.json(userOrders);
};

exports.getLatestOrder = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.user.email }).exec();

    let latestOrder = await Order.findOne({ orderedBy: user._id })
      .populate("products.product")
      .sort({ createdAt: -1 })
      .exec();

    res.json(latestOrder);
  } catch (error) {
    console.error("Error fetching latest order:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// addToWishlist wishlist removeFromWishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  // if COD is true, create order with status of Cash On Delivery

  if (!COD) return res.status(400).send("Create cash order failed");

  const user = await User.findOne({ email: req.user.email }).exec();

  let userCart = await Cart.findOne({ orderedBy: user._id }).exec();

  let finalAmount = 0;

  if (couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount;
    // * 100;
  } else {
    finalAmount = userCart.cartTotal;
    // * 100;
  }

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: finalAmount,
      currency: "vnd",
      status: "Cash On Delivery",
      created: Date.now() / 1000,
      payment_method_types: ["cash"],
    },
    orderedBy: user._id,
    orderStatus: "Cash On Delivery",
  }).save();

  // decrement quantity, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  // await sendConfirmationEmail(user.email, newOrder);

  console.log("NEW ORDER SAVED", newOrder);

  res.json({ ok: true });
};
