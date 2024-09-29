const mongoose = require("mongoose");
const BaseModel = require('./baseModel')
const path = require("path");
const moment = require("moment-timezone"); // moment-timezone paketini kullanacağız

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1, // İsteğe bağlı, varsayılan değer atayabilirsiniz
        },
      },
    ],
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: { currentTime: () => moment().tz("Europe/Istanbul").format() }, // Zaman dilimini ayarladık
  }
);

// Cart belgesi kaydedilmeden önce totalPrice değerini güncelle
cartSchema.pre("save", async function (next) {
  const totalPrice = await this.calculateTotalPrice();
  this.totalPrice = totalPrice;
  next();
});

// totalPrice değerini hesaplamak için fonksiyon
cartSchema.methods.calculateTotalPrice = async function () {
  const Product = mongoose.model("Product"); // Product modelini kullanabilmek için
  let totalPrice = 0;

  // items içindeki ürünlerin fiyatlarını topla
  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (product) {
      totalPrice += product.price * item.quantity;
    }
  }

  return totalPrice;
};

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "items.product",
  });

  next();
});

const Cart = mongoose.model("Cart", cartSchema);
cartSchema.add(BaseModel);
module.exports = Cart;