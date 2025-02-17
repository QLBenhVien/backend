const express = require("express");

const router = express.Router();
const paymentController = require("../controllers/payment.controller");
router.post("/createPaypalPayment", paymentController.createPaypalPayment); 
router.post("/updatePaymentStatusToPaid", paymentController.updatePaymentStatusToPaid); 
module.exports = router;