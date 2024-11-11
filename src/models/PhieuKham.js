const { type } = require("express/lib/response");
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
  TrieuChung: { type: String, default: null },
  ChanDoan: { type: String, default: null },
  TrangThai: { type: Boolean, default: false },
  MaHoaDon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HoaDon", // Tham chiếu đến mô hình HoaDon
    default: null, // Giá trị mặc định là null
  }, 
  LoiDan: { type: String, default: null },
  Thuoc: [
    {
      MaThuoc: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thuoc",
      },  
      DVT: { type: String, required: true },
      SoLuong: { type: Number, required: true }, // Số lượng thuốc
      Cachdung: { type: String, required: true }, // Cách dùng thuốc cụ thể hơn nếu cần
    },
  ],
  pdf_url: { type: String, default: null },
});

const PhieuKham = mongoose.model("PhieuKham", phieuKhamSchema);
module.exports = PhieuKham;
