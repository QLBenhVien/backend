const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	Ten: { type: String },
	NgaySinh: { type: Date, default: null },
	DiaChi: { type: String, default: null },
	CCCD: { type: String, default: null },
	GioiTinh: { type: String, default: null },
	SDT: { type: String, default: null },
	Email: { type: String, default: null },
	active: { type: Boolean, default: true },
	accountId: { type: mongoose.Schema.Types.ObjectId, ref: "TaiKhoan", default: null }, // Thêm mã tham chiếu tới id tài khoản
});

const BenhNhan = mongoose.model("BenhNhan", userSchema);
module.exports = BenhNhan;
