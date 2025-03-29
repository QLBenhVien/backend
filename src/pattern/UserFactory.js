const bcrypt = require("bcrypt");
const TaiKhoan = require("../models/account.model");// Import model tài khoản
const BenhNhan = require("../models/BenhNhan"); // Import model bệnh nhân
const NhanVien = require("../models/NhanVien"); // Import model nhân viên
class UserFactory {
  static async createUser({ email, password, username, role }) {
    const userOld = await TaiKhoan.findOne({ email });
    if (userOld) {
      throw new Error("Người dùng đã tồn tại.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userNew = new TaiKhoan({ email, password: hashPassword, username, role });
    await userNew.save();

    let relatedEntity = null;
    if (role === "KH") {
      relatedEntity = new BenhNhan({ Ten: username, Email: email, active: true, accountId: userNew._id });
    } else if (["LT", "BS", "IT"].includes(role)) {
      relatedEntity = new NhanVien({ HoTen: username, Email: email, MaTK: userNew._id });
    }

    if (relatedEntity) {
      await relatedEntity.save();
    }

    return { userNew, relatedEntity };
  }
}

module.exports = UserFactory;
