const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  listAll,
  remove,
  read,
  update,
  list,
  listAllAll,
  productsCount,
  productStar,
  listRelated,
  searchFilters,
  checkProductAvailability
} = require("../controllers/product");

// routes
router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productsCount);
router.get("/products/:count", listAll);
router.get("/products/all", listAllAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.get("product/check-availability/:slug", checkProductAvailability);
router.put("/product/:slug", authCheck, adminCheck, update);
router.post("/products", list);
router.put("/product/star/:productId", authCheck, productStar);
router.get("/product/related/:productId", listRelated);
router.get("/products/all", listAllAll);
router.post("/search/filters", searchFilters);
module.exports = router;
