const mongoose = require("mongoose");

const chucvuSchema = new mongoose.Schema({
	TenCV: { type: String, required: true }, // Tên chức vụ, ví dụ "Bác sĩ"
	Luong: { type: Number, required: true }, // Lương có kiểu là Number
});

const ChucVu = mongoose.model("ChucVu", chucvuSchema);
module.exports = ChucVu;
