const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Ten: { type: String }, //
  NgaySinh: { type: Date, default: null }, //
  DiaChi: { type: String, default: null }, //
  CCCD: { type: String, default: null }, //
  CCCD_ngayCap: { type: Date, default: null },
  CCCD_noiCap: { type: String, default: null },
  GioiTinh: { type: String, default: null },
  SDT: { type: String, default: null }, //
  Email: { type: String, default: null }, //
  Job: { type: String, default: null }, 
  BHYT: { type: Boolean, default: false }, //
  // active: { type: Boolean, default: true }, //
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TaiKhoan",
    default: null,
  }, // Thêm mã tham chiếu tới id tài khoản
});

const BenhNhan = mongoose.model("BenhNhan", userSchema);
module.exports = BenhNhan;
