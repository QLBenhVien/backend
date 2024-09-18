const mongoose = require("mongoose");

const lichkhamSchema = new mongoose.Schema({
  BacSiID: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien" },
  KhoaID: { type: mongoose.Schema.Types.ObjectId, ref: "Khoa", required: true },  // KhoaID is required
  BenhNhanID: { type: mongoose.Schema.Types.ObjectId, ref: "BenhNhan", required: true },  // BenhNhanID is required
  NhanVienTaoLich: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien" },
  TrieuChung: { type: String },
  TrangThai: { type: Boolean, default: false},  // Default to false and allow null
  NgayDatKham: { type: Date, default: Date.now },  // Default to current date
});

const LichDatKham = mongoose.model("LichDatKham", lichkhamSchema);
module.exports = LichDatKham;
