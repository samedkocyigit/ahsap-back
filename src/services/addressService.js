const Address = require("../models/addressModel");
const AppError = require("../utils/appError");

exports.getAllAddresses = async () => {
  const addresses = await Address.find();
  if (!addresses) {
    throw new AppError("There are no documents for this model", 400);
  }
  return addresses;
};

exports.createAddress = async (data) => {
  const newAddress = await Address.create(data);
  if (!newAddress) {
    throw new AppError("Creation failed", 400);
  }
  return newAddress;
};

exports.getAddressById = async (id) => {
  const address = await Address.findById(id);
  if (!address) {
    throw new AppError("No document with that id", 400);
  }
  return address;
};

exports.updateAddressById = async (id, data) => {
  const updatedAddress = await Address.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updatedAddress) {
    throw new AppError("Update failed", 400);
  }
  return updatedAddress;
};

exports.deleteAddressById = async (id) => {
  const deletedAddress = await Address.findByIdAndDelete(id);
  if (!deletedAddress) {
    throw new AppError("Deletion failed", 400);
  }
  return deletedAddress;
};
