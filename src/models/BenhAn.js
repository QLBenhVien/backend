const mongoose = require("mongoose");

const benhanSchema = new mongoose.Schema({
  MaHS: { type: mongoose.Schema.Types.ObjectId, ref: "HoSo", default: null },
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
