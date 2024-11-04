const mongoose = require("mongoose");

const danhGiaSchema = new mongoose.Schema({
  HoTen: { type: String, required: true },
  Email: { type: String, required: true },
  SDT: { type: String, required: true },
  TieuDe: { type: String, required: true },
  NoiDung: { type: String, required: true },
}, { timestamps: true });

const DanhGia = mongoose.model("DanhGia", danhGiaSchema);
module.exports = DanhGia;
