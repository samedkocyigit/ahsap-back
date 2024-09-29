const sharp = require("sharp");
const path = require("path");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const fs = require('fs').promises;

const FilterProduct = require("../utils/filter")
const targetDir = path.join(
  __dirname,
  "../../../ahsap-frontend/public/images/products/"
);
const targetDir2 = path.join(
  __dirname,
  "../../../Ecommerce-Admin-Panel/public/images/products/"
);


class ProductService {
  async getAllProducts(queryParams) {
    try {
      const query = await Product.find(); // Örnek sorgu, filtrelemeyi ve diğer işlemleri eklemeyi unutmayın
      
      // FilterProduct sınıfına geçirin (Filtreleme, sıralama vb. işlemler için)
      // const features = new FilterProduct(query, queryParams)
      //   .filter()
      //   .sort()
      //   .limitFields()
      //   .paginate();
        
        const products = await query;
  
      if (!products.length) {
        throw new AppError("No products found with the given query.", 404);
      }
  
      return products;
    } catch (err) {
      throw new AppError(err.message, err.status || 500); // Hata yönetimi
    }
  }

  async getProductById(id) {
    const product = await Product.findById(id);
    if (!product) {
      throw new AppError("There is no document with that Id.", 404);
    }
    return product;
  }

  async createProduct(productData) {
    console.log("noldu", productData);
    
    // Yeni ürünü oluştur
    const newProduct = await Product.create({
        name: productData.name,
        price: productData.price,
        summary: productData.summary,
        stock_code: productData.stock_code,
        photos: [],
        photos_detail: []
    });
    
    // Eğer fotoğraflar varsa
    if (productData.photos && Array.isArray(productData.photos)) {
        // Her bir fotoğraf için işlemleri yap
        await Promise.all(productData.photos.map(async (photo, index) => {
            const imageBuffer = photo.buffer; // Buffer'ı doğrudan kullan

            const filename = `product-${newProduct._id}-${Date.now()}-${index + 1}.jpeg`;
            const filenameDetail = `product-detail-${newProduct._id}-${Date.now()}-${index + 1}.jpeg`;

            // Resmi yeniden boyutlandır ve kaydet
            await sharp(imageBuffer)
                .resize(200, 180)
                .toFormat("jpeg")
                .jpeg({ quality: 99 })
                .toFile(`${targetDir}/${filenameDetail}`);

            await fs.copyFile(`${targetDir}/${filenameDetail}`, `${targetDir2}/${filenameDetail}`);


            await sharp(imageBuffer)
                .resize(555, 500)
                .toFormat("jpeg")
                .jpeg({ quality: 99 })
                .toFile(`${targetDir}/${filename}`);

            await fs.copyFile(`${targetDir}/${filenameDetail}`, `${targetDir2}/${filenameDetail}`);

            // Fotoğraf isimlerini diziye ekle
            newProduct.photos.push(filename);
            newProduct.photos_detail.push(filenameDetail);
        }));

        // Ürün nesnesini güncelle ve kaydet
        await newProduct.save();
    }

    // Kategori ve alt kategori işlemleri burada
    // const category = await Category.findById(productData.categoryId);
    // const subCategory = category.sub_category.id(productData.subCategoryId);
    
    // subCategory.sub_product.push(newProduct.id);
    // await category.save();

    return newProduct;
}



  async deleteProduct(id) {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new AppError("Creation process failed", 404);
    }

    await Category.updateMany(
      { "sub_category.sub_product": id },
      { $pull: { "sub_category.$.sub_product": id } }
    );

    return product;
  }

  async updateProduct(id, updateData) {
    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new AppError("Update process failed", 404);
    }

    return product;
  }

  async addCategoryToProduct(productId, categoryId) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError("Product not found.", 404);
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      throw new AppError("Category not found.", 404);
    }

    if (!product.categories.includes(category._id)) {
      product.categories.push(category._id);
    }

    await product.save();
    return product;
  }

  async resizeProductImages(req) {
    if (!req.files || !req.files.photos) {
      return; // Dosya yüklenmemişse veya photos alanı yoksa bir sonraki middleware'e geç
    }
 
    req.body.photos = [];

    await Promise.all(
      req.files.photos.map(async (file, i) => {
        const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(200, 180)
          .toFormat("jpeg")
          .jpeg({ quality: 99 })

        req.body.photos.push(filename);
      })
    );
  }
}

module.exports = new ProductService();
