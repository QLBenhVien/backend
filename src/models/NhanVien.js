const mongoose = require("mongoose");

const nhanvienSchema = new mongoose.Schema({
  MaCV: { type: mongoose.Schema.Types.ObjectId, ref: "ChucVu", default: null },
  MaKhoa: { type: mongoose.Schema.Types.ObjectId, ref: "Khoa", default: null },
  MaTK: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NhanVien",
    default: null,
  },
  HoTen: { type: String, default: null },
  Email: { type: String, default: null },
  DiaChi: { type: String, default: null },
  GioiTinh: { type: String, default: null },
  SDT: { type: String, default: null },
});

const NhanVien = mongoose.model("NhanVien", nhanvienSchema);
module.exports = NhanVien;
