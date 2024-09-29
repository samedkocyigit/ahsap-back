const catchAsync = require("../utils/catchAsync");
const cartService = require("../services/cartService");

exports.createCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.createCart(req.body);
  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await cartService.getCartById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.getAllCarts = catchAsync(async (req, res, next) => {
  const carts = await cartService.getAllCarts();
  res.status(200).json({
    status: "success",
    requiredAt: carts.length,
    data: {
      data: carts,
    },
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const updatedCart = await cartService.updateCartItems(req.params.id, req.body.items);
  res.status(200).json({
    status: "success",
    data: {
      data: updatedCart,
    },
  });
});

exports.deleteProductFromCart = catchAsync(async (req, res, next) => {
  const updatedCart = await cartService.deleteProductFromCart(req.params.id, req.params.productid);
  res.status(200).json({
    status: "success",
    data: {
      data: updatedCart,
    },
  });
});
