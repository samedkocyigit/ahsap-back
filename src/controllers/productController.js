const ProductService = require('../services/productService')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const multer = require('multer')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

exports.uploadProductImages = upload.fields([{ name: 'photos', maxCount: 3 }])

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  await ProductService.resizeProductImages(req)
  next()
})

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await ProductService.getAllProducts(req.query)

  res.status(200).json({
    status: 'success',
    requestedAt: products.length,
    data: {
      data: products,
    },
  })
})

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await ProductService.getProductById(req.params.id)

  res.status(200).json({
    status: 'success',
    data: {
      data: product,
    },
  })
})

exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, price, summary, stock_code } = req.body
  const photos = req.files.photos
  const productData = {
    name,
    price,
    summary,
    stock_code,
    photos,
  }

  const newProduct = await ProductService.createProduct(productData)

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct,
    },
  })
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await ProductService.deleteProduct(req.params.id)

  res.status(200).json({
    status: 'success',
    data: null,
  })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
  console.log('update body', req.body)
  const updatedProduct = await ProductService.updateProduct(req.params.id, req.body)

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedProduct,
    },
  })
})

exports.addCategoryToProduct = catchAsync(async (req, res, next) => {
  const updatedProduct = await ProductService.addCategoryToProduct(req.params.id, req.body.categoryId)

  res.status(200).json({
    status: 'success',
    data: {
      data: updatedProduct,
    },
  })
})
