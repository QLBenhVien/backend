// const bcrypt = require("bcrypt");
// const { TaiKhoan, NhanVien, ChucVu } = require("../models");
const TaiKhoan = require("../../models/account.model");
const ChucVu = require("../../models/ChucVu");
const bcrypt = require("bcryptjs");
const NhanVien = require("../../models/NhanVien");

const dataRoles = {
  IT: "Quản trị viên",
  BS: "Bác Sĩ",
  LT: "Lễ Tân",
  XN: "Xét Nghiệm",
};

class NhanVienFactory {
  static async create(role, nhanVienData) {
    if (!dataRoles[role]) {
      throw new Error(
        "Vai trò không hợp lệ. Vai trò hợp lệ là IT, BS, LT, XN."
      );
    }

    // Tìm chức vụ
    const chucVu = await ChucVu.findOne({ TenCV: dataRoles[role] });
    if (!chucVu) {
      throw new Error("Chức vụ không tồn tại");
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(nhanVienData.password, salt);

    // Tạo tài khoản
    const newAccount = new TaiKhoan({
      email: nhanVienData.email,
      password: hashPassword,
      role,
    });
    const savedAccount = await newAccount.save();

    // Tạo nhân viên
    const newNhanVien = new NhanVien({
      MaTK: savedAccount._id,
      HoTen: nhanVienData.HoTen,
      Email: savedAccount.email,
      DiaChi: nhanVienData.DiaChi,
      GioiTinh: nhanVienData.GioiTinh,
      SDT: nhanVienData.SDT,
      MaCV: chucVu._id,
    });

    if (nhanVienData.Khoa) {
      newNhanVien.MaKhoa = nhanVienData.Khoa;
    }

    const savedNhanVien = await newNhanVien.save();
    return { savedNhanVien, savedAccount };
  }
}

module.exports = NhanVienFactory;
