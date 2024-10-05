const express = require("express");
const itSupportController = require("../controllers/itSupport.controller");
const authJwt = require("../../src/middleware/authJwt");
const authorize = require("../../src/middleware/authorizeRole");

const router = express.Router();

// tạo mới 1 account
router.post(
	"/nhanvien/create",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.createNhanVien
);

// lấy ra tất cả nhân viên
router.get(
	"/nhanvien/all",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.allNhanViens
);

// cập nhật thông tin nhân viên
router.put(
	"/nhanvien/update",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.updateNhanVien
);

// vô hiệu hóa tài khoản nhân viên
router.put(
	"/nhanvien/disable",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.disableNhanVien
);

// kích hoạt tài khoản nhân viên
router.put(
	"/nhanvien/enable",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.enableNhanVien
);

// tìm kiếm account theo id
router.get(
	"/search",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.getAccountById
);

// lấy ra tất cả bệnh nhân
router.get(
	"/benhnhan/all",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.allBenhNhans
);

// cập nhật thông tin bệnh nhân
router.put(
	"/benhnhan/update",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.updateBenhNhan
);

// vô hiệu hóa tài khoản bệnh nhân
router.put(
	"/benhnhan/disable",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.disableBenhNhan
);

// kích hoạt tài khoản bệnh nhân
router.put(
	"/benhnhan/enable",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.enableBenhNhan
);

module.exports = router;
