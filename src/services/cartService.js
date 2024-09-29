const Cart = require("../models/cartModel");
const AppError = require("../utils/appError");
const { ObjectId } = require("mongodb");

exports.createCart = async (data) => {
  const cart = await Cart.create(data);
  return cart;
};

exports.getCartById = async (id) => {
  const cart = await Cart.findById(id);
  if (!cart) {
    throw new AppError("There is no document with that Id.", 404);
  }
  return cart;
};

exports.getAllCarts = async () => {
  const carts = await Cart.find();
  if (!carts) {
    throw new AppError("No documents found.", 404);
  }
  return carts;
};

exports.updateCartItems = async (cartId, items) => {
  const cart = await Cart.findById(cartId);

  if (Array.isArray(items)) {
    // Eğer cart.items boşsa ve yeni ürün eklenecekse, direkt olarak yeni ürünü ekle
    if (cart.items.length === 0 && items.some((item) => item.quantity > 0)) {
      cart.items = items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      }));
    } else {
      for (const item of items) {
        const existingItem = cart.items.find((cartItem) =>
          cartItem.product.equals(item.product)
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;

          // Eğer miktar 0 veya daha az ise ürünü sepetten çıkar
          if (existingItem.quantity <= 0) {
            cart.items = cart.items.filter(
              (cartItem) => !cartItem.product.equals(item.product)
            );
          }
        } else if (item.quantity > 0) {
          // Eğer ürün kartta yoksa ve miktar pozitifse, yeni bir ürün olarak ekle
          cart.items.push({ product: item.product, quantity: item.quantity });
        }
      }
    }
  }

  await cart.save();
  return await Cart.findById(cartId);
};

exports.deleteProductFromCart = async (cartId, productId) => {
  const cart = await Cart.findById(cartId);

  if (!cart) {
    throw new AppError("Cart not found.", 404);
  }

  const index = cart.items.findIndex(
    (item) => item.product._id.toString() === productId
  );

  if (index === -1) {
    throw new AppError("Product not found in the cart.", 404);
  }

  cart.items.splice(index, 1);
  return await cart.save();
};
