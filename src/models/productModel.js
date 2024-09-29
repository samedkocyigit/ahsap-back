const mongoose = require("mongoose");
const BaseModel = require('./baseModel')
const path = require("path");
const { default: slugify } = require("slugify");
const moment = require("moment-timezone"); // moment-timezone paketini kullanacağız

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product must hava a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "Product must have a price"],
    },
    ratingsAverage: {
      type: Number,
      default: 2,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, //4.66666, 46.66666, 4.7,47
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    stock_code: {
      type: Number,
      required: [true, "Product must have a stock code"],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Product must have a summary"],
    },
    photos: [
      {
        type: String,
        required: [true, "Product must have a photo"],
      },
    ],
    photos_detail: [{ type: String }],
    categoryId: String,
    subCategoryId: String,
    ozellikler: [
      {
        name: String,
        value: String,
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: { currentTime: () => moment().tz("Europe/Istanbul").format() }, // Zaman dilimini ayarladık
  }
);

// productSchema.virtual("review", {
//   ref: "Review",
//   foreignField: "user",
//   localField: "_id",
// });

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// productSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "brand",
//     select: "-__v", // Gerekirse brand modelinden alınan alanları seçebilirsiniz
//   });

//   next();
// });

const Product = mongoose.model("Product", productSchema);
productSchema.add(BaseModel);
module.exports = Product;