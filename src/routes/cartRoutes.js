const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.route("/").get(cartController.getAllCarts).post(cartController.createCart);

router.route("/:id").get(cartController.getCart).patch(cartController.updateCartItem);

router.route("/:id/:productid").delete(cartController.deleteProductFromCart);

module.exports = router;