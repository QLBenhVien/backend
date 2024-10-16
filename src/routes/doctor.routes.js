let router = require("express").Router();
const authJwt = require("../../src/middleware/authJwt");
const authorize = require("../../src/middleware/authorizeRole");
const doctorController = require("../controllers/doctor.controller");
