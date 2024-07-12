const express = require("express");
const router = express.Router();
const {
  sendConfirmationEmail,
  createGhnOrder,
  trackOrder,
  getGHNAddress,
} = require("../controllers/orderController");

const { updateOrder } = require("../controllers/user");

const { authCheck } = require("../middlewares/auth");

router.post("/send-confirmation-email", authCheck, sendConfirmationEmail);
router.put("/update-order/:orderId", updateOrder);
// router.post("/create-ghn-order", authCheck, createGhnOrder);
// router.get("/track-order/:orderCode", authCheck, trackOrder);
// router.get("/address/:addressId", authCheck, getGHNAddress);

module.exports = router;
