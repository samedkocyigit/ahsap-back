const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");

class ReviewService {
  async getAllReviews() {
    const reviews = await Review.find();
    if (!reviews) {
      throw new AppError("No reviews found", 404);
    }
    return reviews;
  }

  async getReviewById(reviewId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new AppError("There is no review with that Id", 404);
    }
    return review;
  }

  async createReview(reviewData) {
    const review = await Review.create(reviewData);
    if (!review) {
      throw new AppError("review could not create", 404);
    }
    return review;
  }

  async updateReview(reviewId, updateData) {
    const review = await Review.findByIdAndUpdate(reviewId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      throw new AppError("There is no review with that Id", 404);
    }
    return review;
  }

  async deleteReview(reviewId) {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      throw new AppError("There is no review with that Id", 404);
    }
    return null;
  }
}

module.exports = new ReviewService();
