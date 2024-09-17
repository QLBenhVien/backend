const express = require("express");
const adminController = require("../controllers/admin.controller");
const authJwt = require("../../src/middleware/authJwt");
const router = express.Router();
 
router.get("/users", authJwt.verifyToken, adminController.allUsers);
router.put("/users/:userId/update", authJwt.verifyToken, adminController.updateUser);
router.put("/users/:userId/delete", authJwt.verifyToken, adminController.deleteUser);
router.put("/users/:userId/disable", authJwt.verifyToken, adminController.disableUser);
router.put("/users/:userId/enable", authJwt.verifyToken, adminController.enableUser);

module.exports = router;
