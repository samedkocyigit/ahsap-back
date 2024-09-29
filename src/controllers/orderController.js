const OrderService = require("../services/orderService");
const catchAsync = require("../utils/catchAsync");

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await OrderService.getAllOrders();
  res.status(200).json({
    status: "success",
    requiredAt: orders.length,
    data: {
      data: orders,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await OrderService.getOrder(req.params.id);
  res.status(200).json({
    status: "success",
    data: { data: order },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await OrderService.createOrder(req.body);
  res.status(200).json({
    status: "success",
    data: {
      data: newOrder,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const updatedOrder = await OrderService.updateOrder(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: {
      data: updatedOrder,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  await OrderService.deleteOrder(req.params.id);
  res.status(200).json({
    status: "success",
    data: null,
  });
});
