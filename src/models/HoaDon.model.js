const mongoose = require("mongoose");

const hoaDonSchema = new mongoose.Schema({
  MaPhieu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PhieuKham",
    required: true,
  },
  MaBenhNhan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BenhNhan",
    required: true,
  },
  NgayLap: { type: Date, default: Date.now, required: true }, // Ngày lập hóa đơn
  TongTien: { type: Number, required: true }, // Tổng tiền hóa đơn
  TrangThaiThanhToan: {
    type: String,
    enum: ["Chưa Thanh Toán", "Đã Thanh Toán"], // Trạng thái thanh toán
    default: "Chưa Thanh Toán", // Giá trị mặc định
  },
});

const HoaDon = mongoose.model("HoaDon", hoaDonSchema);
module.exports = HoaDon;
