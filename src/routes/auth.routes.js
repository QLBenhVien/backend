const router = require("express").Router();
const authController = require("../controllers/auth.controller"); // Đổi tên biến về chữ thường

router.post("/login", authController.login);
router.post("/register", authController.register);
module.exports = router;
