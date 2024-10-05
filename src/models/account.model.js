const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
	email: { type: String },
	password: { type: String },
	active: { type: Boolean, default: true },
	role: {
		type: String,
		enum: ["KH", "BS", "LT", "IT"], // Danh sách các vai trò hợp lệ
		default: "KH",
	},
});

const TaiKhoan = mongoose.model("TaiKhoan", accountSchema);
module.exports = TaiKhoan;
