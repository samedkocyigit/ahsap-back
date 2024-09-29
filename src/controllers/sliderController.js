const SliderService = require('../services/sliderService')
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

exports.uploadSliderImages = upload.fields([
  { name: 'mainPhoto', maxCount: 1 }, // Bir adet ana fotoğraf
  { name: 'thumbNailPhoto', maxCount: 1 }, // Bir adet küçük fotoğraf
])

exports.resizeSliderImages = catchAsync(async (req, res, next) => {
  console.log('Body: ', req.body) // Gövde verilerini logla
  console.log('Files: ', req.files) // Dosyaları logla
  await SliderService.resizeSliderImages(req)
  next()
})

exports.createSlider = catchAsync(async (req, res, next) => {
  const newSlider = await SliderService.createSlider(req)
  res.status(201).json({
    status: 'success',
    data: {
      data: newSlider,
    },
  })
})

exports.updateSlider = catchAsync(async (req, res, next) => {
  const updatedSlider = await SliderService.updateSlider(req)
  res.status(201).json({
    status: 'success',
    data: {
      data: updatedSlider,
    },
  })
})

exports.getAllSliders = catchAsync(async (req, res, next) => {
  const sliders = await SliderService.getAllSliders()
  if (!sliders) return next(new AppError('There is no Slider yet'))

  res.status(200).json({
    status: 'success',
    requiredAt: sliders.length,
    data: {
      data: sliders,
    },
  })
})

exports.getSlider = catchAsync(async (req, res, next) => {
  const slider = await SliderService.getSlider(req.params.id)
  if (!slider) return next(new AppError('There is no Slider that id'))

  res.status(200).json({
    status: 'success',
    data: {
      data: slider,
    },
  })
})

exports.deleteSlider = catchAsync(async (req, res, next) => {
  await SliderService.deleteSlider(req.params.id)
  res.status(200).json({
    status: 'success',
    data: {
      data: null,
    },
  })
})
