const express = require("express");
const itSupportController = require("../controllers/itSupport.controller");
const authJwt = require("../../src/middleware/authJwt");
const authorize = require("../../src/middleware/authorizeRole");

const router = express.Router();

router.get(
	"/nhanvien/all",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.allNhanViens
);
router.post(
	"/nhanvien/create",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.addNhanVien
);
router.put(
	"/nhanvien/:nhanVienId/update",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.updateNhanVien
);
router.put(
	"/nhanvien/:nhanVienId/disable",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.disableNhanVien
);
router.put(
	"/nhanvien/:nhanVienId/enable",
	authJwt.verifyToken,
	authorize.authorizeRole("IT"),
	itSupportController.enableNhanVien
);

module.exports = router;
