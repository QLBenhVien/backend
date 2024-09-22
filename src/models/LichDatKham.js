const mongoose = require("mongoose");

const lichdatkhamSchema = new mongoose.Schema({
  BacSiID: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien" },
  BenhNhanID: { type: mongoose.Schema.Types.ObjectId, ref: "BenhNhan" },
  NhanVienTaoLich: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien" },
  KhoaID: { type: mongoose.Schema.Types.ObjectId, ref: "Khoa" },
  TrieuChung: { type: String },
  TrangThai: { type: Boolean, default: false },
  NgayDat: { type: Date, default: Date.now } // Sử dụng default là Date.now
});

const LichDatKham = mongoose.model("LichDatKham", lichdatkhamSchema);
module.exports = LichDatKham;
