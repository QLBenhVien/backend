const mongoose = require("mongoose");

const phieuKhamSchema = new mongoose.Schema({
  MaPhieu: { type: String, required: true }, // Mã phiếu khám
  MaDanhSach: { type: mongoose.Schema.Types.ObjectId, ref: "DanhSach", required: true }, // Mã danh sách
  MaBenhNhan: { type: mongoose.Schema.Types.ObjectId, ref: "BenhNhan", required: true }, // Mã bệnh nhân
  MaNhanVien: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien", required: true }, // Mã nhân viên (bác sĩ)
  NgayKham: { type: Date, required: true }, // Ngày khám bệnh
  TenPhieu: { type: String, default: "Phiếu khám bệnh" }, // Tên phiếu
  SoThuTuKham: { type: Number, required: true }, // Số thứ tự khám
}, {
  timestamps: true // Tự động thêm createdAt và updatedAt
});

const PhieuKham = mongoose.model("PhieuKham", phieuKhamSchema);
module.exports = PhieuKham;