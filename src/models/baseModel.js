const mongoose = require('mongoose');

const BaseSchema = new mongoose.Schema({
  createdTime: {
    type: Date,
    default: Date.now,
  },
  updatedTime: {
    type: Date,
  },
  deletedTime: {
    type: Date,
  },
  isActive:{
    type:Boolean,
    default:true,
  }
});

// Güncellemelerde updatedTime'ı otomatik olarak güncelle
BaseSchema.pre('save', function (next) {
  this.updatedTime = Date.now();
  next();
});

module.exports = BaseSchema;
