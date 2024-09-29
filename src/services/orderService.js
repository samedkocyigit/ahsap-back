const Order = require("../models/orderModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

class OrderService {
  async getAllOrders() {
    const orders = await Order.find();
    if (!orders) {
      throw new AppError("Find no document in Order model", 404);
    }
    return orders;
  }

  async getOrder(orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError("No document with that ID", 404);
    }
    return order;
  }

  async createOrder(orderData) {
    const { user, address, cart } = orderData;

    const newOrder = await Order.create({
      user: user,
      address: address,
      cart: cart,
    });

    if (!newOrder) {
      throw new AppError("Order creation failed", 400);
    }

    const userUpdateResponse = await User.findByIdAndUpdate(
      user,
      { $push: { orders: newOrder._id } },
      { new: true, runValidators: true }
    );

    if (!userUpdateResponse) {
      throw new AppError("User update failed", 400);
    }

    return newOrder;
  }

  async updateOrder(orderId, updateData) {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      throw new AppError("Order update failed", 400);
    }

    return updatedOrder;
  }

  async deleteOrder(orderId) {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      throw new AppError("Order deletion failed", 400);
    }

    return null;
  }
}

module.exports = new OrderService();
