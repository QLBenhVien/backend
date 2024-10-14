const { successResponse, errorResponse } = require("../helpers/index");

const NhanVien = require("../models/NhanVien");
const BenhNhan = require("../models/BenhNhan");
const TaiKhoan = require("../models/account.model");

// Lấy thông tin chi tiết tài khoản qua ID
const getAccountById = async (req, res) => {
	try {
		const { accountId } = req.query; // Lấy accountId từ query

		const account = await TaiKhoan.findById(accountId);
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
		const { email, password, HoTen, DiaChi, GioiTinh, SDT, MaCV, MaKhoa, role } = req.body;

		// Kiểm tra vai trò hợp lệ
		const validRoles = ["IT", "BS", "LT"];
		if (!validRoles.includes(role)) {
			return errorResponse(
				req,
				res,
				"Vai trò không hợp lệ. Vai trò hợp lệ là IT, BS, LT.",
				400
			);
		}

		// Tạo tài khoản mới
		const newAccount = new TaiKhoan({
			email,
			password,
			role, // Sử dụng vai trò từ body
		});

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
			MaCV,
			MaKhoa,
		});

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
		const lstNhanViens = await NhanVien.find({});
		return successResponse(req, res, { lstNhanViens });
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

const updateNhanVien = async (req, res) => {
	try {
		const { MaTK, ...updateData } = req.body;

		const nhanVien = await NhanVien.findOne({ MaTK: MaTK });
		console.log(nhanVien);
		if (!nhanVien) {
			return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
		}

		Object.assign(nhanVien, updateData);
		const updatedNhanVien = await nhanVien.save();

		return successResponse(req, res, {
			message: "Thông tin nhân viên đã được cập nhật thành công",
			updatedNhanVien,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

// Vô hiệu hóa tài khoản nhân viên
const disableNhanVien = async (req, res) => {
	try {
		const { MaTK } = req.body;
		const nhanVien = await NhanVien.findOne({ MaTK: MaTK });

		if (!nhanVien) {
			return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
		}

		nhanVien.active = false;
		await nhanVien.save();

		return successResponse(req, res, {
			message: "Nhân viên đã bị vô hiệu hóa thành công",
			nhanVien,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

// Kích hoạt lại tài khoản nhân viên
const enableNhanVien = async (req, res) => {
	try {
		const { MaTK } = req.body;

		const nhanVien = await NhanVien.findOne({ MaTK: MaTK });

		if (!nhanVien) {
			return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
		}

		nhanVien.active = true;
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
		const lstBenhNhans = await BenhNhan.find({});
		return successResponse(req, res, { lstBenhNhans });
	} catch (error) {
		return errorResponse(req, res, error.message);
	}
};

const updateBenhNhan = async (req, res) => {
	try {
		const { MaTK, ...updateData } = req.body;

		const benhNhan = await BenhNhan.findOne({ MaTK: MaTK });

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

// Vô hiệu hóa tài khoản bệnh nhân
const disableBenhNhan = async (req, res) => {
	try {
		const { MaTK } = req.body;
		const benhNhan = await BenhNhan.findOne({ MaTK: MaTK });

		if (!benhNhan) {
			return errorResponse(req, res, "Không tìm thấy bệnh nhân", 404);
		}

		benhNhan.active = false;
		await benhNhan.save();

		return successResponse(req, res, {
			message: "Bệnh nhân đã bị vô hiệu hóa thành công",
			benhNhan,
		});
	} catch (error) {
		return errorResponse(req, res, error.message);
		i;
	}
};

// Kích hoạt lại tài khoản bệnh nhân
const enableBenhNhan = async (req, res) => {
	try {
		const { MaTK } = req.body;

		const benhNhan = await BenhNhan.findOne({ MaTK: MaTK });

		if (!benhNhan) {
			return errorResponse(req, res, "Không tìm thấy bệnh nhân", 404);
		}

		benhNhan.active = true;
		await benhNhan.save();

		return successResponse(req, res, {
			message: "Bệnh nhân đã được kích hoạt lại thành công",
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
