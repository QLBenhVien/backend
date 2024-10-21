const express = require("express");
const departmentController = require("../controllers/department.controller");
const authJwt = require("../middleware/authJwt");
const router = express.Router();
 
router.get("/listdepartment", departmentController.listDepartments); 

module.exports = router;
