let router = require("express").Router();
const DoctorController = require("../controllers/doctor.controller");
const authJwt = require("../../src/middleware/authJwt");
const authorize = require("../../src/middleware/authorizeRole");

router.get(
  "/getInformationdoctor",
  authJwt.verifyToken,
  authorize.authorizeRole("BS"),
  DoctorController.home
);
