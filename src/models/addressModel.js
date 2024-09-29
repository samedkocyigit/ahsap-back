const mongoose = require("mongoose");
const moment = require("moment-timezone"); // moment-timezone paketini kullanacağız

const addressesSchema = new mongoose.Schema(
  {
    province: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    district: String,
    country: String,
    name: String,
    surname: String,
    phone: String,
    cell_phone: String,
    id_no: Number,
    address: String,
    address_title: String,
    bill_type: {
      type: String,
      Enum: ["Bireysel", "Kurumsal"],
      default: "Bireysel",
    },
  },
  {
    timestamps: { currentTime: () => moment().tz("Europe/Istanbul").format() }, // Zaman dilimini ayarladık
  }
);

const Address = mongoose.model("Address", addressesSchema);

module.exports = Address;