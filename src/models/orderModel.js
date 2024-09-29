const mongoose = require("mongoose");
const BaseModel = require('./baseModel')
const moment = require("moment-timezone"); // moment-timezone paketini kullanacağız

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    cart: { type: mongoose.Schema.ObjectId, ref: "Cart" },
    address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
    },
  },
  {
    timestamps: { currentTime: () => moment().tz("Europe/Istanbul").format() }, // Zaman dilimini ayarladık
  }
);

const Order = mongoose.model("Order", orderSchema);

orderSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "user",
      select: "-__v",
    },
    {
      path: "cart",
      select: "-__v",
    },
    {
      path: "address",
      select: "-__v",
    },
  ]);
  next();
});

orderSchema.add(BaseModel);
module.exports = Order;