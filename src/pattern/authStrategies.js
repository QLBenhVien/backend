const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { TaiKhoan } = require("../models/account.model"); // Import các model
const {BenhNhan} = require("../models/BenhNhan");
const {NhanVien} = require("../models/NhanVien");
class PatientAuthStrategy {
  async authenticate(email, password) {
    const user = await TaiKhoan.findOne({ email });
    if (!user || !user.active) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const patient = await BenhNhan.findOne({ accountId: user.id });
    if (!patient) return null;

    return {
      id: user.id,
      role: "patient",
      email: user.email,
      active: user.active,
    };
  }
}



class StaffAuthStrategy {
  async authenticate(email, password) {
    const user = await TaiKhoan.findOne({ email });
    if (!user || !user.active) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const staff = await NhanVien.findOne({ MaTK: user.id });
    if (!staff) return null;

    return {
      id: user.id,
      role: "staff",
      email: user.email,
      active: user.active,
    };
  }
}

// Lớp Context quản lý chiến lược xác thực
class AuthContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  async authenticate(email, password) {
    return await this.strategy.authenticate(email, password);
  }
}

module.exports = {
  PatientAuthStrategy,
  StaffAuthStrategy,
  AuthContext,
};
