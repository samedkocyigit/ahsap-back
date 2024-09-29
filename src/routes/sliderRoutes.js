const express = require('express')
const router = express.Router()
const sliderController = require('../controllers/sliderController')
// const authController = require("../controllers/authController");s

router.route('/').get(sliderController.getAllSliders).post(
  // authController.protect,
  // authController.restrictTo("admin"),
  sliderController.uploadSliderImages,
  sliderController.resizeSliderImages,
  sliderController.createSlider,
)

router
  .route('/:id')
  .get(sliderController.getSlider)
  .patch(sliderController.updateSlider)
  .delete(sliderController.deleteSlider)

module.exports = router
