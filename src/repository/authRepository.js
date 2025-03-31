const TaiKhoan = require("../models/account.model");
const bcrypt = require("bcryptjs");

class AuthRepository {
  // Tạo tài khoản mới
  async createAccount(data) {
    return await TaiKhoan.create(data);
  }

  // Tìm tài khoản theo email
  async getAccountByEmail(email) {
    return await TaiKhoan.findOne({ email });
  }

  // Lấy tài khoản theo ID
  async getAccountById(id) {
    return await TaiKhoan.findById(id);
  }

  // Cập nhật tài khoản
  async updateAccount(id, data) {
    return await TaiKhoan.findByIdAndUpdate(id, data, { new: true });
  }

  // Xóa tài khoản
  async deleteAccount(id) {
    return await TaiKhoan.findByIdAndDelete(id);
  }

  // Kiểm tra mật khẩu
  async comparePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}

module.exports = new AuthRepository();
