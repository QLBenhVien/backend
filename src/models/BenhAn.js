const mongoose = require("mongoose");

const benhanSchema = new mongoose.Schema({
  MaPK: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhieuKham",
    default: null,
  },
  MaHD: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HoaDon",
    default: null,
  },
});

const BenhAn = mongoose.model("BenhAn", benhanSchema);
module.exports = BenhAn;
