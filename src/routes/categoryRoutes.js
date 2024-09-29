const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .get(categoryController.getCategoryById)
  // .post(
  //   categoryController.uploadSubCategoyImages,
  //   categoryController.resizeSubCategoryImages,
  //   categoryController.createSubCategory
  // )
  .patch(categoryController.updateCategory)
  // .put(categoryController.putFilterAtCategory)
  .delete(categoryController.deleteCategory);

router
  .route("/:id/filters/:filterId")
  .delete(categoryController.removeFilterFromCategory);

// router.route("/for-products/:id").get(categoryController.getCategoryForProducts);

router.route("/slug/:slug").get(categoryController.getCategoryBySlug);

// router
//   .route("/subcategoryslug/:slug")
//   .get(categoryController.getSubCategoryBySlug);

// router
//   .route("/:id/sub_category/:sub_category_id")
//   .get(categoryController.getSubCategoryUnderCategory)
//   // .post(categoryController.addProductAtSubCategory)
//   .patch(categoryController.updateSubCategory)
//   .delete(categoryController.deleteSubCategory);

// router
//   .route("/for-products/:id/sub_category/:sub_category_id")
//   .get(categoryController.getProductsUnderSubCategory);
module.exports = router;