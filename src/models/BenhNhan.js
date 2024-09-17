const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Ten: { type: String },
  NgaySinh: { type: Date, default: null },
  DiaChi: { type: String, default: null },
  CCCD: { type: String, default: null },
  GioiTinh: { type: String, default: null },
  SDT: { type: String, default: null },
  Email: { type: String, default: null },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "TaiKhoan" }, // Thêm mã tham chiếu tới id tài khoản
});

const BenhNhan = mongoose.model("BenhNhan", userSchema);
module.exports = BenhNhan;
