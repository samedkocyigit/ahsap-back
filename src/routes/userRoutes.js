const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//Protect all routes after this middleware
// router.use(authcontroller.protect);

// router.get("/me", authController.getMe,);
router.patch("/updatePassword", authController.updatePassword);

// only admin access from here
// router.use(authcontroller.restrictTo("admin"));

router.route("/").get(userController.getAllUsers).post(userController.createOneUser);
router.route("/admin").get(userController.getAllAdmins);

router
  .route("/:id")
  .get(userController.getOneUser)
  .patch(userController.updateOneUser)
  .delete(userController.deleteOneUser);

router.route("/:id/:address").patch(userController.addAdressToUser);

module.exports = router;