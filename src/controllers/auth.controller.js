const TaiKhoan = require("../models/account.model");
const BenhNhan = require("../models/BenhNhan");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { successResponse, errorResponse } = require("../helpers/index");
const express = require("express");
const router = express.Router();

function AuthController() {
  this.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(`email: ${email}; pass: ${password}`);
    await TaiKhoan.findOne({ email })
      .then(async (user) => {
        if (!user) {
          return errorResponse(req, res, "Không tìm thấy người dùng.");
        }
        if (!user.active) {
          // Kiểm tra tài khoản có bị vô hiệu hóa không
          return errorResponse(req, res, "Tài khoản đã bị vô hiệu hóa.", 403);
        }

        var passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
          return errorResponse(req, res, "Mật khẩu không hợp lệ!", 401);
        }

        // Tạo payload cho token tùy thuộc vào vai trò của người dùng
        const payload = {
          user: {
            userId: user.id,
            email: user.email,
            role: user.role,
            createdAt: new Date(),
          },
        };

        // Thay đổi key hoặc cấu hình tùy thuộc vào vai trò (nếu cần thiết)
        const token = jwt.sign(payload, process.env.JWT_KEY, {
          expiresIn: 3600, // 1 giờ
        });
        return successResponse(req, res, {
          id: user.id,
          email: user.email,
          role: user.role, // Thêm vai trò vào phản hồi
          accessToken: token,
        });
      })
      .catch((err) => {
        return errorResponse(req, res, err.message);
      });
  };

  this.register = async (req, res, next) => {
    const {
      email,
      password,
      username,
      role,
      Ten,
      DiaChi,
      CCCD,
      GioiTinh,
      SDT,
    } = req.body;

    // Kiểm tra xem có bất kỳ trường nào bị bỏ trống không
    if (!email || !password || !username || !role || !Ten) {
      return errorResponse(
        req,
        res,
        "Bạn cần nhập đầy đủ các thông tin để đăng ký tài khoản."
      );
    }

    // Kiểm tra định dạng email
    if (!email.endsWith("@gmail.com")) {
      return errorResponse(req, res, "Email phải có định dạng @gmail.com.");
    }

    // Kiểm tra người dùng đã tồn tại chưa
    const userOld = await TaiKhoan.findOne({ email });
    if (userOld != null) {
      return errorResponse(req, res, "Người dùng đã tồn tại.");
    }

    // Kiểm tra tên người dùng đã tồn tại chưa
    const userWithSameUsername = await TaiKhoan.findOne({ username });
    if (userWithSameUsername != null) {
      return errorResponse(req, res, "Tên người dùng đã tồn tại.");
    }
    // Tạo một đối tượng người dùng mới
    const userNew = new TaiKhoan({ email, password, username, role });

    // Băm mật khẩu
    const salt = await bcrypt.genSalt(10);
    userNew.password = await bcrypt.hash(password, salt);

    // Lưu người dùng mới
    const saveUserNew = await userNew.save();
    if (!saveUserNew) {
      return errorResponse(req, res, "Lưu tài khoản không thành công.");
    }

    // Tạo bản ghi cho bệnh nhân
    const benhNhanNew = new BenhNhan({
      Ten,
      DiaChi: DiaChi || null,
      CCCD: CCCD || null,
      GioiTinh: GioiTinh || null,
      SDT: SDT || null,
      Email: email,
      accountId: saveUserNew._id, // Liên kết tài khoản với bệnh nhân
    });

    // Lưu thông tin bệnh nhân
    const saveBenhNhanNew = await benhNhanNew.save();
    if (!saveBenhNhanNew) {
      return errorResponse(req, res, "Lưu bệnh nhân không thành công.");
    }

    // Trả về phản hồi thành công
    return successResponse(req, res, {
      id: saveUserNew.id,
      email: saveUserNew.email,
      role: saveUserNew.role,
      benhNhanId: saveBenhNhanNew._id, // Trả thêm thông tin về bệnh nhân
    });
  };

  return this;
}

//tạo hồ sơ bệnh nhân
module.exports.createPatientProfile = async (req, res) => {
  try {
    const { Ten, NgaySinh, DiaChi, GioiTinh, SDT, CCCD, Email } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!Ten || !Email) {
      return res.status(400).json({ message: "Tên và email là bắt buộc." });
    }

    // Tạo một hồ sơ bệnh nhân mới
    const newPatient = new BenhNhan({
      Ten,
      NgaySinh,
      DiaChi,
      GioiTinh,
      SDT,
      CCCD,
      Email,
    });

    // Lưu hồ sơ bệnh nhân vào cơ sở dữ liệu
    const savedPatient = await newPatient.save();

    // Phản hồi với hồ sơ bệnh nhân đã tạo
    res.status(201).json({
      message: "Hồ sơ bệnh nhân đã được tạo thành công",
      patient: savedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

module.exports = AuthController();
