const catchAsync = require("../utils/catchAsync");
const userService = require("../services/userService");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: "success",
    requestedAt: users.length,
    data: {
      data: users,
    },
  });
});
exports.getAllAdmins = catchAsync(async (req, res, next) => {
  const users = await userService.getAllAdmins();

  res.status(200).json({
    status: "success",
    requestedAt: users.length,
    data: {
      data: users,
    },
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

exports.createOneUser = catchAsync(async (req, res, next) => {
  const newUser = await userService.createUser(req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: newUser,
    },
  });
});

exports.updateOneUser = catchAsync(async (req, res, next) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: {
      data: updatedUser,
    },
  });
});

exports.deleteOneUser = catchAsync(async (req, res, next) => {
  await userService.deleteUser(req.params.id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

exports.addAdressToUser = catchAsync(async (req, res, next) => {
  const user = await userService.addAddressToUser(req.params.id, req.params.address);

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
