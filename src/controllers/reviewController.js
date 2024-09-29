const reviewService = require("../services/reviewService");
const catchAsync = require("../utils/catchAsync");

exports.setProductUserIds = (req, res, next) => {
  // Nested routes support
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReview = catchAsync(async (req, res, next) => {
  const reviews = await reviewService.getAllReviews();
  res.status(200).json({
    status: "success",
    requiredAt: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await reviewService.getReviewById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      data: review,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await reviewService.createReview(req.body);
  res.status(200).json({
    status: "success",
    data: {
      data: review,
    },
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const updatedReview = await reviewService.updateReview(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: {
      review: updatedReview,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await reviewService.deleteReview(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      data: null,
    },
  });
});
