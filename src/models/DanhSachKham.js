const mongoose = require("mongoose");

const danhsachkhamSchema = new mongoose.Schema({
  MaNV: { type: mongoose.Schema.Types.ObjectId, ref: "NhanVien" },
  NgayKham: { type: Date, default: null },
  Ca: { type: Number, default: 1 },
});

const DanhSachKham = mongoose.model("DanhSachKham", danhsachkhamSchema);
module.exports = DanhSachKham;
