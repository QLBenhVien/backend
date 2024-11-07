const mongoose = require("mongoose");

const hosoSchema = new mongoose.Schema({
  MaBenhNhan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BenhNhan",
    default: null,
  },
  MaBenhAn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BenhAn",
    default: null,
  },
});

const Hosobenhan = mongoose.model("Hosobenhan", hosoSchema);
module.exports = Hosobenhan;
