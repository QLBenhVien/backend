let router = require("express").Router();
const ReceptionistController = require("../controllers/receptionist.controller");
const authJwt = require("../../src/middleware/authJwt");
const authorize = require("../../src/middleware/authorizeRole");
const applyMiddlewares = require("../patterns/admin/decorator");

// Middleware mặc định cho lễ tân (LT)
const LT_MIDDLEWARES = [authJwt.verifyToken, authorize.authorizeRole("LT")];

router.post("/scheduleappointment", ReceptionistController.scheduleappointment);

router.put(
  "/approveappointment/:id",
  applyMiddlewares(LT_MIDDLEWARES, ReceptionistController.approveappointment)
);

router.put(
  "/cancelappointment",
  applyMiddlewares(LT_MIDDLEWARES, ReceptionistController.cancelappointment)
);

router.post(
  "/updateappointment/:appointmentID",
  applyMiddlewares(LT_MIDDLEWARES, ReceptionistController.updateAppointment)
);

router.get(
  "/getAlldatkham",
  applyMiddlewares(LT_MIDDLEWARES, ReceptionistController.listLichdat)
);

router.get(
  "/detailDatkham/:id",
  applyMiddlewares(LT_MIDDLEWARES, ReceptionistController.detailAppointment)
);

router.get(
  "/home",
  applyMiddlewares(LT_MIDDLEWARES, ReceptionistController.home)
);

router.post("/listAppointment", ReceptionistController.listAppointment);
router.get("/chitietphieukham/:id", ReceptionistController.chitietphieukham);
router.get(
  "/paymentforexamination/:appointmentId",
  ReceptionistController.paymentForExamination
);

module.exports = router;
