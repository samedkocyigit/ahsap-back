const sharp = require('sharp')
const path = require('path')
const Slider = require('../models/sliderModel')
const fs = require('fs').promises

const targetDirMain = path.join(__dirname, '../../../ahsap-frontend/public/images/sliders/main-photo')
const targetDirMain2 = path.join(__dirname, '../../../Ecommerce-Admin-Panel/public/images/sliders/main-photo')
const targetDirThumb = path.join(__dirname, '../../../ahsap-frontend/public/images/sliders/thumbnail-photo')
const targetDirThumb2 = path.join(__dirname, '../../../Ecommerce-Admin-Panel/public/images/sliders/thumbnail-photo')

exports.resizeSliderImages = async (req) => {
  if (!req.files || !req.files.photos) {
    return // Dosya yüklenmemişse işleme devam etme
  }

  req.body.photos = []

  await Promise.all(
    req.files.photos.map(async (file, i) => {
      const photoFilename = `slider-${req.params.id}-${Date.now()}-${i + 1}.jpeg`
      const thumbFilename = `slider-${req.params.id}-${Date.now()}-${i + 1}-thumb.jpeg`

      await sharp(file.buffer)
        .resize(1920, 542)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`${targetDirMain}/${photoFilename}`)

      await sharp(file.buffer)
        .resize(70, 40)
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toFile(`${targetDirThumb}/${thumbFilename}`)

      req.body.photos.push({ mainPhoto: photoFilename, thumbNailPhoto: thumbFilename })
    }),
  )
}

exports.updateSlider = async (req) => {
  const updatedSlider = await Slider.sliderSchema.findById(req.params.id)
  const newPhotos = await Slider.sliderPhotoSchema.create({
    mainPhoto: req.body.photos[0],
    thumbNailPhoto: req.body.photos[1],
  })

  const newPhotoNames = []
  const photoBuffer = Buffer.from(newPhotos.mainPhoto.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const thumbBuffer = Buffer.from(newPhotos.thumbNailPhoto.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const photoFilename = `slider-${updatedSlider._id}-${Date.now()}-.jpeg`
  const thumbFilename = `slider-${updatedSlider._id}-${Date.now()}-thumb.jpeg`

  await sharp(photoBuffer).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`${targetDir}/${photoFilename}`)

  await sharp(thumbBuffer).toFormat('jpeg').jpeg({ quality: 80 }).toFile(`${targetDir}/${thumbFilename}`)

  newPhotoNames.push({ mainPhoto: photoFilename, thumbNailPhoto: thumbFilename })
  newPhotos.mainPhoto = newPhotoNames[0].mainPhoto
  newPhotos.thumbNailPhoto = newPhotoNames[0].thumbNailPhoto

  await newPhotos.save()
  await updatedSlider.photos.push(newPhotos._id)
  await updatedSlider.save()

  return updatedSlider
}

exports.createSlider = async (req) => {
  // Fotoğrafların buffer verilerini al
  const photoBuffer = req.files.mainPhoto[0].buffer
  const thumbBuffer = req.files.thumbNailPhoto[0].buffer

  // Yeni slider'ı oluştur ve kaydetmeden önce veritabanına ekleyin
  const newSlider = await Slider.sliderSchema.create({
    name: req.body.name, // Slider ismi req.body'den geliyor
  })

  // Fotoğraf adlarını belirleyin, yeni slider'ın ID'sini kullanarak
  const photoFilename = `slider-${newSlider._id}-${Date.now()}-main.jpeg`
  const thumbFilename = `slider-${newSlider._id}-${Date.now()}-thumb.jpeg`

  // Buffer ile fotoğrafları işleyip diske kaydedin
  await sharp(photoBuffer).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`${targetDirMain}/${photoFilename}`)
  await fs.copyFile(`${targetDirMain}/${photoFilename}`, `${targetDirMain2}/${photoFilename}`)

  await sharp(thumbBuffer).toFormat('jpeg').jpeg({ quality: 80 }).toFile(`${targetDirThumb}/${thumbFilename}`)
  await fs.copyFile(`${targetDirThumb}/${thumbFilename}`, `${targetDirThumb2}/${thumbFilename}`)

  // Fotoğrafları veritabanına kaydedin
  const newPhotos = await Slider.sliderPhotoSchema.create({
    mainPhoto: photoFilename, // Dosya adını veritabanına kaydediyoruz
    thumbNailPhoto: thumbFilename, // Thumbnail dosya adını kaydediyoruz
  })

  // Slider'ı güncelle ve fotoğrafları ilişkilendir
  newSlider.photos = newPhotos._id // Yeni fotoğrafların _id'si ile slider'ı ilişkilendiriyoruz
  await newSlider.save() // Slider'ı güncelleyin ve kaydedin

  return newSlider
}

exports.getAllSliders = async () => {
  return await Slider.sliderSchema.find()
}

exports.getSlider = async (id) => {
  return await Slider.sliderSchema.findById(id)
}

exports.deleteSlider = async (id) => {
  await Slider.sliderSchema.findByIdAndDelete(id)
}
