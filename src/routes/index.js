const express = require("express");

const userRoute = require("./user.routes");
const authRoute = require("./auth.routes");
const adminRoute = require("./admin.routes");
const receptionistRoute = require("./receptionist.routes");
const itSupportRoute = require("./itSupport.routes");


router.use("/", authRoute);
router.use("/user", userRoute);
router.use("/admin", adminRoute);
router.use("/itSupport", itSupportRoute);
router.use("/receptionist", receptionistRoute);


module.exports = router;
