const express = require("express");

const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const authJwt = require("../../src/middleware/authJwt");
const authorize = require("../../src/middleware/authorizeRole");
router.get(
  "/getAllhoso",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  doctorController.getAllhsba
);
router.get(
  "/detailHoso/:id",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  doctorController.detailHoso
);
router.get(
  "/getPhieukham/:option",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  doctorController.getPhieukham
);
router.get(
  "/detailPhieukham/:id",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  doctorController.detailPhieukham
);
router.put(
  "/updatePhieukham/:id",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  doctorController.updatePhieukham
);
router.put(
  "/endPhieukham/:id",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  doctorController.endPhieukham
);
router.get("/thuoc/:ten", doctorController.goiyThuoc);
router.put(
  "/themlichlam",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  doctorController.themlichlam
);
router.get(
  "/lichlam",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  doctorController.thongtinlichlam
);
// check laij
// router.get("/listdoctor/:departmentId", doctorController.listDoctors);
module.exports = router;
