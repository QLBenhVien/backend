const AuthRepository = require("../repository/authRepository");
const UserFactory = require("../pattern/UserFactory");
const BenhNhan = require("../models/BenhNhan");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


// Strategy pattern
const { PatientAuthStrategy, StaffAuthStrategy, AuthContext } = require("../pattern/authStrategies");

class AuthController {
  constructor() {
    this.authStrategies = {
      patient: new PatientAuthStrategy(),
      staff: new StaffAuthStrategy(),
    };
    this.authContext = new AuthContext(null);
  }

  // Đăng nhập
  async login(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!this.authStrategies[role]) {
        return errorResponse(req, res, "Loại người dùng không hợp lệ!", 400);
      }

      this.authContext.setStrategy(this.authStrategies[role]);

      const user = await this.authContext.authenticate(email, password);
      if (!user) {
        return errorResponse(req, res, "Email hoặc mật khẩu không đúng!", 401);
      }

      const payload = { user };
      const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" });

      return successResponse(req, res, { ...user, accessToken: token });
    } catch (err) {
      return errorResponse(req, res, err.message);
    }
  }
  //*********************Code đăng ký cũ trước khi áp dụng Factory Pattern ************************ */

//   this.register = async (req, res, next) => {
//     try {
//       const { email, password, username, role } = req.body;

//       // Kiểm tra các trường thông tin cần thiết
//       if (!email || !password || !username || !role) {
//         return errorResponse(
//           req,
//           res,
//           "Bạn cần nhập đầy đủ các thông tin để tạo tài khoản"
//         );
//       }

//       // Kiểm tra xem người dùng đã tồn tại chưa
//       const userOld = await TaiKhoan.findOne({ email });
//       if (userOld != null) {
//         return errorResponse(req, res, "Người dùng đã tồn tại.");
//       }

//       const salt = await bcrypt.genSalt(10);
//       // const hashPassword = await bcrypt.hash(res.body.password, salt);
//       const hashPassword = await bcrypt.hash(req.body.password, salt);

//       // Tạo tài khoản mới và mã hóa mật khẩu
//       const userNew = new TaiKhoan({ ...req.body, password: hashPassword });
//       console.log(userNew);
//       // Lưu tài khoản mới
//       const saveUserNew = await userNew.save();

//       if (saveUserNew != null) {
//         if (role === "KH") {
//           // Nếu role là null, tạo một Bệnh nhân mới
//           const newBenhNhan = new BenhNhan({
//             Ten: username,
//             Email: email,
//             active: true,
//             accountId: saveUserNew._id, // MaTK là _id của tài khoản vừa tạo
//           });

//           // Lưu thông tin bệnh nhân mới
//           const saveBenhNhan = await newBenhNhan.save();

//           if (saveBenhNhan) {
//             return successResponse(req, res, {
//               message: "User registered successfully as BenhNhan",
//               taiKhoan: saveUserNew,
//               benhNhan: saveBenhNhan,
//             });
//           } else {
//             return errorResponse(
//               req,
//               res,
//               "Lưu thông tin bệnh nhân không thành công"
//             );
//           }
//         } else if (role === "LT" || role === "BS" || role === "IT") {
//           const newNhanVien = new NhanVien({
//             HoTen: username,
//             Email: email,
//             MaTK: saveUserNew._id, // MaTK là _id của tài khoản vừa tạo
//           });

//           // Lưu thông tin nhân viên mới
//           const saveNhanVien = await newNhanVien.save();

//           if (saveNhanVien) {
//             return successResponse(req, res, {
//               message: "User registered successfully as NhanVien",
//               taiKhoan: saveUserNew,
//               nhanVien: saveNhanVien,
//             });
//           } else {
//             return errorResponse(
//               req,
//               res,
//               "Lưu thông tin nhân viên không thành công"
//             );
//           }
//         } else {
//           // Trường hợp role không phải "LT" hoặc null, chỉ trả về thông tin tài khoản mới
//           return successResponse(req, res, {
//             id: saveUserNew.id,
//             email: saveUserNew.email,
//             role: saveUserNew.role,
//           });
//         }
//       } else {
//         return errorResponse(req, res, "Lưu không thành công");
//       }
//     } catch (error) {
//       return errorResponse(req, res, error.message);
//     }
//   };

//   return this;
// }


  // Đăng ký tài khoản
  async register(req, res) {
    try {
      const { email, password, username, role } = req.body;

      if (!email || !password || !username || !role) {
        return errorResponse(req, res, "Bạn cần nhập đầy đủ thông tin.");
      }

      // Kiểm tra xem người dùng đã tồn tại chưa
      const userOld = await AuthRepository.getAccountByEmail(email);
      if (userOld) {
        return errorResponse(req, res, "Người dùng đã tồn tại.");
      }

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      // Tạo tài khoản mới
      const newUser = await AuthRepository.createAccount({ email, username, role, password: hashPassword }); // Để lưu tài khoản mới vào db

      // Tạo thông tin user dựa trên role 
      let userInstance = null;
      try {
        userInstance = await UserFactory.createUser(role, username, email, newUser._id); // Tạo đối tượng cựu thể 
        //UserFactory quyết định tạo đối tượng nào dựa trên role

        if (userInstance) {
          const savedUserInstance = await userInstance.save();
          return successResponse(req, res, {                 // Nếu tạo thành công sẽ lưu vào database 
            message: `User registered successfully as ${role}`,
            taiKhoan: newUser,
            userData: savedUserInstance, // Trả về thông tin bệnh nhân/ nhân viên mới 
          });
        }
      } catch (err) {
        console.error("Lỗi khi tạo User Instance:", err);
      }

      return successResponse(req, res, { // Nếu không tạo được thông tin user thì trả về thông tin tài khoản
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });
    } catch (error) {
      console.error("Lỗi trong quá trình đăng ký:", error);
      return errorResponse(req, res, error.message || "Lỗi máy chủ nội bộ");
    }
  }

  // Tạo hồ sơ bệnh nhân
  async createPatientProfile(req, res) {
    try {
      const { Ten, NgaySinh, DiaChi, GioiTinh, SDT, CCCD, Email } = req.body;

      if (!Ten || !Email) {
        return res.status(400).json({ message: "Tên và email là bắt buộc." });
      }

      const newPatient = new BenhNhan({ Ten, NgaySinh, DiaChi, GioiTinh, SDT, CCCD, Email });
      const savedPatient = await newPatient.save();

      res.status(201).json({
        message: "Hồ sơ bệnh nhân đã được tạo thành công",
        patient: savedPatient,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
    }
  }
}

module.exports = new AuthController();
