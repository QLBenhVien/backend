const mongoose = require("mongoose");

const lichkhamSchema = new mongoose.Schema({
  BacSiID: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien" },
  KhoaID: { type: mongoose.Schema.Types.ObjectId, ref: "Khoa", required: true }, // KhoaID is required
  BenhNhanID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BenhNhan",
    required: true,
  }, // BenhNhanID is required
  TrieuChung: { type: String, default: null },
  TrangThai: { type: Boolean, default: false }, // Default to false and allow null
  DaHuy: { type: Boolean, default: false },
  NgayDatKham: { type: Date, default: Date.now }, // Default to current date
  CaKham: { type: Number, default: 1 },
  SoThuTuKham: { type: Number }, // Số thứ tự khám
});

const LichDatKham = mongoose.model("LichDatKham", lichkhamSchema);
module.exports = LichDatKham;
