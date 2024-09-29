const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const AppError = require("../utils/appError");

exports.getAllUsers = async () => {
  return await User.find({role:"user"});
};

exports.getAllAdmins = async ()=>{
  return await User.find({role:"admin"})
}
exports.getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("No document found with that ID", 404);
  }
  return user;
};

exports.createUser = async (userData) => {
  const newUser = await User.create(userData);

  const newCart = await Cart.create({
    userId: newUser._id,
  });

  await User.findByIdAndUpdate(newUser._id, { cart: newCart._id });

  return newUser;
};

exports.updateUser = async (id, userData) => {
  const updatedUser = await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError("No document found with that ID", 404);
  }

  return updatedUser;
};

exports.deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new AppError("No document found with that ID", 404);
  }

  return deletedUser;
};

exports.addAddressToUser = async (id, address) => {
  const user = await User.findByIdAndUpdate(
    id,
    { $push: { address: address } },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError("Kullanıcı bulunamadı", 404);
  }

  return user;
};
