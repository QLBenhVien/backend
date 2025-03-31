// commands/ThemLichLamCommand.js
const DanhSachKham = require("../../../models/DanhSachKham.js");
const LichLamFactory = require("../LichLamFactory.js");
// const Command = require("./Command.js");
class ThemLichLamCommand {
  constructor(NhanVienId, NgayKham, Ca) {
    this.NhanVienId = NhanVienId;
    this.NgayKham = NgayKham;
    this.Ca = Ca;
  }

  async execute() {
    // Kiểm tra xem ca đã tồn tại chưa
    const existingShift = await DanhSachKham.findOne({
      MaNV: this.NhanVienId,
      NgayKham: this.NgayKham,
      Ca: this.Ca,
    });

    if (existingShift) {
      console.log("Ca này đã được đăng ký trước đó la: ", existingShift);
      throw new Error("Ca này đã được đăng ký trước đó");
    }

    // Tạo lịch làm mới bằng Factory
    const newLichLam = new DanhSachKham(
      LichLamFactory.create(this.NhanVienId, this.NgayKham, this.Ca)
    );

    return await newLichLam.save();
  }
}

module.exports = ThemLichLamCommand;
