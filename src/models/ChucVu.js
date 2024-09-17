const mongoose = require("mongoose");

const chucvuSchema = new mongoose.Schema({
  TenCV: { type: String },
  Luong: { type: Int32Array },
});
const ChucVu = mongoose.model("ChucVu", chucvuSchema);
module.exports = ChucVu;
