const express = require("express");

const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
router.get("/listdoctor/:departmentId", doctorController.listDoctors); 
router.post("/available-doctors", doctorController.listAvailableDoctors);

module.exports = router;