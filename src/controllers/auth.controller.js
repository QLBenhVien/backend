const TaiKhoan = require("../models/account.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { successResponse, errorResponse } = require("../helpers/index");

function AuthController() {
  this.login = async (req, res, next) => {
    const { email, password } = req.body;

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
    const { email, password, username, role } = req.body;

    if (!email || !password || !username || !role) {
      return errorResponse(
        req,
        res,
        "Bạn cần nhập đầy đủ các thông tin để nhập tài khoản"
      );
    }

    const userNew = new TaiKhoan(req.body);
    console.log(userNew);
    const userOld = await TaiKhoan.findOne({ email });
    if (userOld != null) {
      return errorResponse(req, res, "Người dùng đã tồn tại.");
    }
    const salt = await bcrypt.genSalt(10);
    userNew.password = await bcrypt.hash(userNew.password, salt);
    const saveUserNew = await userNew.save();
    if (saveUserNew != null) {
      return successResponse(req, res, {
        id: saveUserNew.id,
        email: saveUserNew.email,
        role: saveUserNew.role,
      });
    } else {
      return errorResponse(req, res, "Lưu không thành công");
    }
  };

  return this;
}

module.exports = AuthController();
