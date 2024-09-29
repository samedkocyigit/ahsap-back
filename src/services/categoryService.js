const sharp = require("sharp");
const path = require("path");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const FilterProduct = require("../utils/filter");

const targetDirCategory = path.join(__dirname, "../../../frontend/public/images/categories/");
const targetDirSubCategory = path.join(__dirname, "../../../frontend/public/images/categories/subCategories");

class CategoryService {
  async resizeCategoryImages(req) {
    if (!req.files || !req.files.photos) return;

    req.body.photos = [];

    await Promise.all(
      req.files.photos.map(async (file, i) => {
        const filename = `category-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize({ width: 240, height: 320, withoutEnlargement: true })
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${targetDirCategory}/${filename}`);

        req.body.photos.push(filename);
      })
    );
  }

  async resizeSubCategoryImages(req) {
    if (!req.files || !req.files.photos) return;

    req.body.photos = [];

    await Promise.all(
      req.files.photos.map(async (file, i) => {
        const filename = `subCategory-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize({ width: 150, height: 160, withoutEnlargement: true })
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${targetDirSubCategory}/${filename}`);

        req.body.photos.push(filename);
      })
    );
  }

  async getAllCategories() {
    const categories = await Category.find();
    if (!categories) throw new AppError("No documents found.", 404);
    return categories;
  }

  async createCategory(reqBody) {
    const category = await Category.create(reqBody);
    if (!category) throw new AppError("Documents could not be created.", 404);

    return category;
  }

  async getCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) throw new AppError("There is no document with that Id.", 404);
    return category;
  }

  async getCategoryBySlug(slug) {
    const category = await Category.findOne({slug:`${slug}`});
    if (!category) throw new AppError("There is no document with that Id.", 404);
    return category;
  }

  async updateCategory(id, reqBody) {
    const category = await Category.findByIdAndUpdate(id, reqBody, {
      new: true,
      runValidators: true,
    });
    if (!category) throw new AppError("Documents could not be updated.", 404);
    return category;
  }

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new AppError("There is no document with that Id.", 404);
    return category;
  }

  async addFilterToCategory(id, filters) {
    filters = filters.map((filter) => {
      filter.slug = slugify(filter.name, { lower: true });
      if (filter.values) {
        filter.values = filter.values.map((value) => {
          value.slug = slugify(value.name, { lower: true });
          return value;
        });
      }
      return filter;
    });

    const category = await Category.findByIdAndUpdate(
      id,
      { $push: { filter: { $each: filters } } },
      { new: true, runValidators: true }
    );

    if (!category) throw new AppError("Documents could not be updated.", 404);
    return category;
  }

  async removeFilterFromCategory(categoryId, filterId) {
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $pull: { filter: { _id: filterId } } },
      { new: true, runValidators: true }
    );

    if (!category) throw new AppError("Documents could not be updated.", 404);
    return category;
  }

  async getProductsForCategory(categoryId, query) {
    const products = Product.find({ categoryId });
    const features = new FilterProduct(products, query).filter().sort().limitFields().paginate();
    const productsList = await features.query;

    return productsList;
  }

  async getSubCategoryBySlug(slug) {
    const category = await Category.findOne({ "sub_category.slug": slug });
    if (!category) throw new AppError("Sub Category not found", 404);
    return category.sub_category.find((sub) => sub.slug === slug);
  }

  async updateSubCategory(categoryId, subCategoryId, updateBody) {
    const category = await Category.findById(categoryId);
    if (!category) throw new AppError("No category found", 404);

    const subCategory = category.sub_category.id(subCategoryId);
    if (!subCategory) throw new AppError("No subcategory found", 404);

    Object.keys(updateBody).forEach((key) => {
      subCategory[key] = updateBody[key];
    });

    await category.save();
    return category;
  }

  async addProductToSubCategory(categoryId, subCategoryId, productId) {
    const category = await Category.findById(categoryId);
    if (!category) throw new AppError("No category found", 404);

    const subCategory = category.sub_category.id(subCategoryId);
    const product = await Product.findById(productId);
    if (!product) throw new AppError("No product found", 404);

    product.categoryId = category.id;
    product.subCategoryId = subCategory.id;
    subCategory.sub_product.push(productId);

    await product.save();
    await category.save();

    return category;
  }

  async deleteSubCategory(categoryId, subCategoryId) {
    const category = await Category.findById(categoryId);
    if (!category) throw new AppError("No category found", 404);

    const subCategory = category.sub_category.id(subCategoryId);
    subCategory.remove();

    await category.save();
    return category;
  }
}

module.exports = new CategoryService();
