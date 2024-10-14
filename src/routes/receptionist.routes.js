let router = require("express").Router();
const ReceptionistController = require("../controllers/receptionist.controller");
const authJwt = require("../../src/middleware/authJwt");
const authorize = require("../../src/middleware/authorizeRole");

router.post(
	"/scheduleappointment",
	authJwt.verifyToken,
	ReceptionistController.scheduleappointment
);
router.post(
	"/approveappointment/:appointmentID",
	authJwt.verifyToken,
	authorize.authorizeRole("LT"),
	ReceptionistController.approveappointment
);
router.post(
	"/cancelappointment/:appointmentID",
	authJwt.verifyToken,
	authorize.authorizeRole("LT"),
	ReceptionistController.cancelappointment
);
router.post(
	"/updateappointment/:appointmentID",
	authJwt.verifyToken,
	authorize.authorizeRole("LT"),
	ReceptionistController.updateAppointment
);

router.get(
  "/getAlldatkham",
  authJwt.verifyToken,
  authorize.authorizeRole("LT"),
  ReceptionistController.listLichdat
);
router.get(
  "/detailDatkham/:id",
  authJwt.verifyToken,
  authorize.authorizeRole("LT"),
  ReceptionistController.detailAppointment
);

module.exports = router;
