const catchAsync = require("../utils/catchAsync");
const addressService = require("../services/addressService");

exports.getAllAddresses = catchAsync(async (req, res, next) => {
  const addresses = await addressService.getAllAddresses();
  res.status(200).json({
    status: "success",
    requiredAt: addresses.length,
    data: {
      data: addresses,
    },
  });
});

exports.createAddress = catchAsync(async (req, res, next) => {
  const newAddress = await addressService.createAddress(req.body);
  res.status(200).json({
    status: "success",
    data: {
      data: newAddress,
    },
  });
});

exports.getAddress = catchAsync(async (req, res, next) => {
  const address = await addressService.getAddressById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      data: address,
    },
  });
});

exports.updateAddress = catchAsync(async (req, res, next) => {
  const updatedAddress = await addressService.updateAddressById(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: {
      data: updatedAddress,
    },
  });
});

exports.deleteAddress = catchAsync(async (req, res, next) => {
  await addressService.deleteAddressById(req.params.id);
  res.status(200).json({
    status: "success",
    data: null,
  });
});

