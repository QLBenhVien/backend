const express = require("express");

const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
router.get("/getAllhoso", doctorController.getAllhsba);
router.get("/getPhieukham/:option", doctorController.getPhieukham);
router.get("/detailPhieukham/:id", doctorController.detailPhieukham);
router.put("/updatePhieukham/:id", doctorController.updatePhieukham);
router.put("/endPhieukham/:id", doctorController.endPhieukham);
router.get("/thuoc/:ten", doctorController.goiyThuoc);
router.put("/themlichlam/:id", doctorController.themlichlam);
// router.get("/listdoctor/:departmentId", doctorController.listDoctors);
module.exports = router;
