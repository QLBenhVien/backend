const express = require("express");

const router = express.Router();
const doctorController = require("../controllers/doctor.controller");

// router.get("/listdoctor/:departmentId", doctorController.listDoctors);
// router.post("/available-doctors", doctorController.listAvailableDoctors);

const authJwt = require("../../src/middleware/authJwt");
const authorize = require("../../src/middleware/authorizeRole");
const applyMiddlewares = require("../patterns/admin/decorator");
const LT_MIDDLEWARES = [authJwt.verifyToken, authorize.authorizeRole("BS")];

router.get("/getAllhoso", LT_MIDDLEWARES, doctorController.getAllhsba);
router.get("/detailHoso/:id", LT_MIDDLEWARES, doctorController.detailHoso);
router.get(
  "/getPhieukham/:option",
  LT_MIDDLEWARES,
  doctorController.getPhieukham
);
router.get(
  "/detailPhieukham/:id",
  LT_MIDDLEWARES,
  doctorController.detailPhieukham
);
router.put(
  "/updatePhieukham/:id",
  LT_MIDDLEWARES,
  doctorController.updatePhieukham
);
// router.put(
//   "/endPhieukham/:id",
//   authJwt.verifyToken,
//   authorize.authorizeRole("BS"),
//   doctorController.endPhieukham
// );
router.get("/thuoc/:ten", doctorController.goiyThuoc);
router.put("/themlichlam", LT_MIDDLEWARES, doctorController.themlichlam);
router.get("/lichlam", LT_MIDDLEWARES, doctorController.thongtinlichlam);
// check laij
// router.get("/listdoctor/:departmentId", doctorController.listDoctors);
module.exports = router;
