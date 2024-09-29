const mongoose = require("mongoose");
const BaseModel = require('./baseModel')
const slugify = require("slugify");
const moment = require("moment-timezone"); // moment-timezone paketini kullanacağız

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: [true, "Category must hava a name"],
      unique: true,
    },
    photos: [String],
    slug: String,
    filter: [
      {
        name: String,
        slug: String,
        values: [{ name: String, slug: String }],
      },
    ],
    sub_category: [
      {
        sub_category_name: { type: String },
        photos: [String],
        slug: String,
        sub_product: [
          {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: false,
            unique: false,
          },
        ],
      },
    ],
  },
  {
    timestamps: { currentTime: () => moment().tz("Europe/Istanbul").format() }, // Zaman dilimini ayarladık
  }
);

categorySchema.pre("save", function (next) {
  this.slug = slugify(this.category_name, { lower: true });

  if (!this.sub_category || this.sub_category.length === 0) {
    return next();
  }
  this.sub_category.forEach((sub) => {
    // Alt kategori adı varsa işlem yap
    const subCategoryName = sub.sub_category_name;
    sub.slug = slugify(subCategoryName, { lower: true });
  });
  next();
});

// categorySchema.pre("findOneAndUpdate", function (next) {
//   this.slug = slugify(this.category_name, { lower: true });

//   if (!this.sub_category || this.sub_category.length === 0) {
//     return next();
//   }
//   this.sub_category.forEach((sub) => {
//     // Alt kategori adı varsa işlem yap
//     const subCategoryName = sub.sub_category_name;
//     sub.slug = slugify(subCategoryName, { lower: true });
//   });
//   next();
// });

categorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "sub_category.sub_product",
    select: "-__v ",
  });

  next();
});

const Category = mongoose.model("Category", categorySchema);
categorySchema.add(BaseModel);
module.exports = Category;