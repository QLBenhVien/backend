const express = require("express");
const authJwt = require("../../src/middleware/authJwt");
const route = express.Router();

const User = require("../controllers/user.controller");

route.get("/", User.hello);
route.post("/dangky", User.dangkyTK);
route.post("/dangnhap", User.dangnhap);
route.get("/trangchu", User.home);

route.get("/me", authJwt.verifyToken, User.getMyAccountInfo);
route.put(
  "/updateMyAccountInfo",
  authJwt.verifyToken,
  User.updateMyAccountInfo
);
route.post("/resetpassword", authJwt.verifyToken, User.Resetpassword);

// dang ky kham benh pages
route.get("/dangkykhambenh/theongay", User.Theongay);
route.post("/dangkykhambenh/datkham", User.Datkham);

route.get("/thongbao", authJwt.verifyToken, User.thongbao);

// Tạo hồ sơ bệnh nhân
route.post("/taohosobn", authJwt.verifyToken, User.createPatientProfile);
//Tìm hồ sơ bệnh nhân (tìm theo cccd, email hoặc SĐT)
route.get("/timhosobn", authJwt.verifyToken, User.findPatientProfile);
// Lấy thông tin hồ sơ bệnh nhân
route.get("/getHoso", authJwt.verifyToken, User.getAllinfoHS);
//Cập nhật thông tin hồ sơ (với điều kiện nhập đúng cccd và sđt)
route.put("/capnhathoso", authJwt.verifyToken, User.updatePatientProfile);
//Đặt khám
route.put("/datkham", User.datKham);
//thong tin dat kham
route.get("/thongtindatkham", authJwt.verifyToken, User.getInfoDatKham);
//xem lịch đặt khám (check từ số CCCD,SĐT và Email)
route.get("/xemlichkham", authJwt.verifyToken, User.xemLichKham);
// xem chi tiet lixh kham
route.put("/xemchitietlichkham", authJwt.verifyToken, User.xemchitietLichKham);
// tìm lịch khám của bác sĩ
route.put("/timlichkham", authJwt.verifyToken, User.timlichkham);
//huy lich kham
route.put("/huylichkham", authJwt.verifyToken, User.huylichdat);

//cập nhật lịch khám
route.put("/capnhatlichkham", authJwt.verifyToken, User.capNhatLichKham);
//tìm bác sĩ
route.get("/timkiemnhanvien", authJwt.verifyToken, User.timKiemNhanVien);

//xem phieu kham
route.put("/xemphieukham", authJwt.verifyToken, User.xemphieukham);

//test tinh nang them lich kham
route.put("/themlichkham", User.themlichlam);
module.exports = route;
