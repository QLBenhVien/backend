let router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const authJwt = require("../middleware/authJwt");
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
module.exports = router;
