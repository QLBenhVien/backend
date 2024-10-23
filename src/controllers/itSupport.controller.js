const { successResponse, errorResponse } = require("../helpers/index");

const NhanVien = require("../models/NhanVien");
const BenhNhan = require("../models/BenhNhan");
const TaiKhoan = require("../models/account.model");
const ChucVu = require("../models/ChucVu");
const bcrypt = require("bcryptjs");
// Lấy thông tin chi tiết tài khoản qua ID
const getAccountById = async (req, res) => {
	try {
		const { accountId } = req.query; // Lấy accountId từ query
		console.log(req.query);
		const account = await TaiKhoan.findOne({ email: accountId });
		if (!account) {
			return errorResponse(req, res, "Không tìm thấy tài khoản", 404);
		}

		return successResponse(req, res, {
			message: "Thông tin tài khoản được tìm thấy",
			account,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

// -------------------------- NHÂN VIÊN -------------------------
// tạo mới tài khoản nhân viên
const createNhanVien = async (req, res) => {
	try {
		const { email, password, HoTen, DiaChi, GioiTinh, SDT, MaCV, Khoa, role } = req.body;
		console.log(req.body);
		// Kiểm tra vai trò hợp lệ
		const validRoles = ["IT", "BS", "LT", "XN"];

		const dataRoles = {
			IT: "Quản trị viên",
			BS: "Bác Sĩ",
			LT: "Lễ Tân",
			XN: "Xét Nghiệm",
		};

		const roleName = dataRoles[role];
		// const validRoles = ["IT", "Bác Sĩ", "Lễ Tân", "Xét Nghiệm"];

		if (!validRoles.includes(role)) {
			return errorResponse(
				req,
				res,
				"Vai trò không hợp lệ. Vai trò hợp lệ là IT, BS, LT.",
				400
			);
		}

		const chucVu = await ChucVu.findOne({
			TenCV: roleName,
		});

		if (!chucVu) {
			return res.status(404).json({ message: "Chức vụ không tồn tại" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);
		// Tạo tài khoản mới
		const newAccount = new TaiKhoan({
			email,
			password: hashPassword,
			role, // Sử dụng vai trò từ body
		});
		console.log(chucVu);
		// Lưu tài khoản vào cơ sở dữ liệu
		const savedAccount = await newAccount.save();

		// Tạo nhân viên mới
		const newNhanVien = new NhanVien({
			MaTK: savedAccount._id, // Liên kết với tài khoản mới tạo
			HoTen,
			Email: savedAccount.email, // Lấy email từ tài khoản đã lưu
			DiaChi,
			GioiTinh,
			SDT,
			MaCV: chucVu._id,
		});

		if (Khoa) newNhanVien.MaKhoa = Khoa;

		// Lưu nhân viên vào cơ sở dữ liệu
		const savedNhanVien = await newNhanVien.save();

		return successResponse(req, res, {
			message: "Tạo nhân viên thành công",
			nv: savedNhanVien,
			account: savedAccount,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

// Lấy tất cả tài khoản nhân viên
const allNhanViens = async (req, res) => {
	try {
		const lstNhanViens = await NhanVien.find({})
			.populate({
				path: "MaCV",
				select: "TenCV",
			})
			.populate({
				path: "MaTK",
				select: "active",
			});

		return successResponse(req, res, { lstNhanViens });
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

const updateNhanVien = async (req, res) => {
	try {
		const { MaTK, role, ...updateData } = req.body;
		console.log(req.body);
		const dataRoles = {
			IT: "Quản trị viên3",
			BS: "Bác Sĩ",
			LT: "Lễ Tân",
			XN: "Xét Nghiệm",
		};

		const roleName = dataRoles[role];
		const chucVu = await ChucVu.findOne({
			TenCV: roleName,
		});

		if (!chucVu) {
			return res.status(404).json({ message: "Chức vụ không tồn tại" });
		}

		const nhanVien = await NhanVien.findOne({ MaTK: MaTK });

		if (!nhanVien) {
			return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
		}

		Object.assign(nhanVien, {
			...updateData,
			MaCV: chucVu._id,
			MaKhoa: updateData.Khoa,
		});
		const updatedNhanVien = await nhanVien.save();

		return successResponse(req, res, {
			message: "Thông tin nhân viên đã được cập nhật thành công",
			updatedNhanVien,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

const disableNhanVien = async (req, res) => {
	try {
		console.log("Request received to disable employee:", req.body); // Log request body
		const { MaTK } = req.body;

		const nhanVien = await TaiKhoan.findOneAndUpdate({ _id: MaTK }, { active: false });
		console.log("NhanVien:", nhanVien);
		if (!nhanVien) {
			return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
		}
		// await nhanVien.save();

		return successResponse(req, res, {
			message: "Nhân viên đã bị vô hiệu hóa thành công",
			nhanVien,
		});
	} catch (error) {
		console.error("Error disabling employee:", error); // Log error
		return errorResponse(req, res, error.message);
	}
};

const enableNhanVien = async (req, res) => {
	try {
		const { MaTK } = req.body;
		// const nhanVien = await NhanVien.findOne({ MaTK: MaTK });
		const nhanVien = await TaiKhoan.findOneAndUpdate({ _id: MaTK }, { active: true });
		console.log("NhanVien:", nhanVien);
		if (!nhanVien) {
			return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
		}
		// nhanVien.active = true;
		await nhanVien.save();

		return successResponse(req, res, {
			message: "Nhân viên đã được kích hoạt lại thành công",
			nhanVien,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

// -------------------------- BỆNH NHÂN -------------------------

// Lấy tất cả tài khoản bệnh nhân
const allBenhNhans = async (req, res) => {
	try {
		const lstBenhNhans = await BenhNhan.find({}).populate({
			path: "accountId",
			select: "active",
		});
		return successResponse(req, res, { lstBenhNhans });
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

const updateBenhNhan = async (req, res) => {
	try {
		const { accountID, ...updateData } = req.body;
		console.log("profileBN", req.body);
		const benhNhan = await BenhNhan.findOne({ accountID: accountID });
		console.log("benhNhan", benhNhan);
		if (!benhNhan) {
			return errorResponse(req, res, "Không tìm thấy bệnh nhân", 404);
		}

		Object.assign(benhNhan, updateData);
		const updatedBenhNhan = await benhNhan.save();

		return successResponse(req, res, {
			message: "Thông tin bệnh nhân đã được cập nhật thành công",
			updatedBenhNhan,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};
// disable bệnh nhân
const disableBenhNhan = async (req, res) => {
	try {
		console.log("Request received to disable employee:", req.body);
		const { accountId } = req.body;

		const benhnhan = await TaiKhoan.findOneAndUpdate({ _id: accountId }, { active: false });
		console.log("benhnhan:", benhnhan);
		if (!benhnhan) {
			return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
		}
		// await benhnhan.save();

		return successResponse(req, res, {
			message: "Nhân viên đã bị vô hiệu hóa thành công",
			benhnhan,
		});
	} catch (error) {
		console.error("Error disabling employee:", error); // Log error
		return errorResponse(req, res, error.message);
	}
};

const enableBenhNhan = async (req, res) => {
	try {
		const { accountId } = req.body;
		const benhNhan = await TaiKhoan.findOneAndUpdate({ _id: accountId }, { active: true });
		console.log("BenhNhan:", benhNhan);
		if (!benhNhan) {
			return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
		}
		// benhNhan.active = true;
		await benhNhan.save();

		return successResponse(req, res, {
			message: "Nhân viên đã được kích hoạt lại thành công",
			benhNhan,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

module.exports = {
	allNhanViens,
	createNhanVien,
	updateNhanVien,
	disableNhanVien,
	enableNhanVien,
	allBenhNhans,
	updateBenhNhan,
	disableBenhNhan,
	enableBenhNhan,
	getAccountById,
};
