const mongoose = require("mongoose");

const phieuKhamSchema = new mongoose.Schema({
  MaPhieu: { type: String, required: true, unique: true },
  MaDanhSach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DanhSachKham",
    required: true,
  },
  MaBenhNhan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BenhNhan",
    required: true,
  },
  MaNhanVien: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NhanVien",
    required: true,
  },
  NgayKham: { type: Date, required: true },
  TenPhieu: {
    type: String,
    default: "Phiếu khám bệnh",
    required: true,
  },
  CaKham: { type: Number, default: 1 },
  SoThuTuKham: { type: Number, required: true },
  ChanDoan: { type: String, default: null },
  Thuoc: [
    {
      TenThuoc: { type: String, default: null }, // Medicine name
      HamLuong: { type: String, default: null }, // Dosage or concentration (e.g., 500mg)
      DonViTinh: { type: String, default: null }, // Unit (e.g., "viên")
      SoLuong: { type: Number, default: null }, // Quantity prescribed
    },
  ],
});

const PhieuKham = mongoose.model("PhieuKham", phieuKhamSchema);
module.exports = PhieuKham;
