const catchAsync = require("../utils/catchAsync");
const CategoryService = require("../services/CategoryService");
const AppError = require("../utils/appError");
const multer = require("multer");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCategoryImages = upload.fields([{ name: "photos" }]);

exports.resizeCategoryImages = catchAsync(async (req, res, next) => {
  await CategoryService.resizeCategoryImages(req);
  next();
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await CategoryService.getAllCategories();
  res.status(200).json({
    status: "success",
    data: {
      categories,
    },
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryService.createCategory(req.body);
  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.getCategoryById = catchAsync(async (req, res, next) => {
  const category = await CategoryService.getCategoryById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.getCategoryBySlug = catchAsync(async (req, res, next) => {
  const category = await CategoryService.getCategoryBySlug(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  console.log("la havlesin ",req.body)
  const category = await CategoryService.updateCategory(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  await CategoryService.deleteCategory(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.addFilterToCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryService.addFilterToCategory(req.params.id, req.body.filter);
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.removeFilterFromCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryService.removeFilterFromCategory(req.params.id, req.params.filterId);
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

// Subcategory actions
exports.getSubCategoryBySlug = catchAsync(async (req, res, next) => {
  const subCategory = await CategoryService.getSubCategoryBySlug(req.params.slug);
  res.status(200).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});

exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryService.updateSubCategory(req.params.id, req.params.sub_category_id, req.body);
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.addProductToSubCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryService.addProductToSubCategory(req.params.id, req.params.sub_category_id, req.body.productId);
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  await CategoryService.deleteSubCategory(req.params.id, req.params.sub_category_id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
