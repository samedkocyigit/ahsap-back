const UserService = require("../services/userService");
const AuthService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await UserService.signUp(req);
  UserService.createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await AuthService.login(email, password);
  AuthService.createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  req.user = await UserService.protect(token);
  res.locals.user = req.user;
  next();
});

exports.restrictTo = (roles) => {
  return (req, res, next) => {
    UserService.restrictTo(roles, req.user.role);
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  await UserService.forgotPassword(req.body.email);
  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await UserService.resetPassword(req.params.token, req.body.password);
  UserService.createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await UserService.updatePassword(
    req.user,
    req.body.passwordCurrent,
    req.body.password
  );
  UserService.createSendToken(user, 200, res);
});
