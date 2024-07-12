const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");
// controllers
const {
  userCart,
  getUserCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  createCashOrder,
  savePhone,
  getLatestOrder,
} = require("../controllers/user");

router.post("/user/cart", authCheck, userCart); // save cart
router.get("/user/cart", authCheck, getUserCart); // get cart
router.delete("/user/cart", authCheck, emptyCart); // empty cart
router.post("/user/address", authCheck, saveAddress);
router.post("/user/phone", authCheck, savePhone)

router.post("/user/order", authCheck, createOrder); // stripe
router.post("/user/cash-order", authCheck, createCashOrder); // cod
router.get("/user/orders", authCheck, orders);
router.get("/user/latest-order", authCheck, getLatestOrder);

// coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

// wishlist
router.get("/user/wishlist", authCheck, wishlist);
router.post("/user/wishlist", authCheck, addToWishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

// router.get("/user", (req, res) => {
//   res.json({
//     data: "hey you hit user API endpoint",
//   });
// });

module.exports = router;
