const express = require("express");
const authJwt = require("../../src/middleware/authJwt");
const route = express.Router();


const User = require("../controllers/user.controller");

route.get("/", User.hello);
route.post("/dangky", User.dangkyTK);
route.post("/dangnhap", User.dangnhap);
route.get("/trangchu", User.home);


route.get("/me", authJwt.verifyToken, User.getMyAccountInfo);
route.put("/updateMyAccountInfo", authJwt.verifyToken,User.updateMyAccountInfo);

// dang ky kham benh pages
route.get("/dangkykhambenh/theongay", User.Theongay);
route.post("/dangkykhambenh/datkham", User.Datkham);

route.get("/thongbao", User.thongbao);
route.post("/laylaimk", User.laylaimk);
module.exports = route;
