const mongoose = require('mongoose')
const baseModel = require('./baseModel')
const moment = require('moment-timezone') // moment-timezone paketini kullanacağız

// Fotoğraflar ve küçük resimler için alt şema
const sliderPhotoSchema = new mongoose.Schema(
  {
    mainPhoto: {
      type: String,
      required: [true, 'Photo must have a URL'],
    },
    thumbNailPhoto: {
      type: String,
      required: [true, 'Photo must have a thumbnail URL'],
    },
  },
  {
    timestamps: { currentTime: () => moment().tz('Europe/Istanbul').format() }, // Zaman dilimini ayarladık
  },
)
const SliderPhoto = mongoose.model('SliderPhoto', sliderPhotoSchema)

const sliderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Campaign must have a name'],
  },
  photos: [{ type: mongoose.Schema.ObjectId, ref: 'SliderPhoto' }], // photos dizisi içinde photoSchema nesneleri
})

sliderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'photos',
    select: '-__v ',
  })
  next()
})
const Slider = mongoose.model('Slider', sliderSchema)
const Sliders = {
  sliderPhotoSchema: SliderPhoto,
  sliderSchema: Slider,
}
sliderSchema.add(baseModel)
module.exports = Sliders
