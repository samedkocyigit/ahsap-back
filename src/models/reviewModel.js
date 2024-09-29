const mongoose = require("mongoose");
const BaseModel = require('./baseModel')
const Product = require("../models/productModel");
const moment = require("moment-timezone"); // moment-timezone paketini kullanacağız

const reviewSchema = new mongoose.Schema(
  {
    title: { type: String, require: [true, "Title can not be empty!"] },
    review: { type: String, require: [true, "Review can not be empty!"] },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now, select: false },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "review must belong to a product"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { currentTime: () => moment().tz("Europe/Istanbul").format() }, // Zaman dilimini ayarladık
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name surname",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.product);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const review = mongoose.model("review", reviewSchema);
reviewSchema.add(BaseModel);
module.exports = review;