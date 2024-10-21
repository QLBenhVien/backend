const express = require("express");

const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
router.get("/listdoctor/:departmentId", doctorController.listDoctors); 
module.exports = router;