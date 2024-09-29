const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

class UserService {
  signToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  createSendToken(user, statusCode, res) {
    const token = this.signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        data: user,
      },
    });
  }

  async signUp(req) {
    const newUser = await User.create({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      phone: req.body.phone,
      taxOffice: req.body.taxOffice,
      taxNumber: req.body.taxNumber,
    });

    const newCart = await Cart.create({
      userId: newUser._id,
    });

    await User.findByIdAndUpdate(newUser._id, { cart: newCart._id });

    const url = `${req.protocol}://${req.get("host")}/me`;
    console.log(url);
    // await new Email(newUser, url).sendWelcome()

    return newUser;
  }

  async login(email, password) {
     const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    return user;
  }

  async protect(token) {
    if (!token) {
      throw new AppError("You are not logged in! Please log in to get access", 401);
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token does no longer exist.",
        401
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new AppError("User recently changed password! Please log in again.", 401);
    }

    return currentUser;
  }

  restrictTo(roles, userRole) {
    if (!roles.includes(userRole)) {
      throw new AppError("You do not have permission to perform this action", 403);
    }
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("There is no user with this email address.", 401);
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you did not forget your password, please ignore this email.`;

    try {
      await Email({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        msg: message,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new AppError("There was an error sending the email. Try again later", 500);
    }
  }

  async resetPassword(token, password) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError("Token is invalid or has expired", 400);
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return user;
  }

  async updatePassword(currentUser, currentPassword, newPassword) {
    if (!(await currentUser.correctPassword(currentPassword, currentUser.password))) {
      throw new AppError("Your current password is wrong.", 404);
    }

    currentUser.password = newPassword;
    await currentUser.save();

    return currentUser;
  }
}

module.exports = new UserService();
