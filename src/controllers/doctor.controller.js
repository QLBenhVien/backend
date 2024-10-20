const NhanVien = require("../models/NhanVien");
const { successResponse, errorResponse } = require("../helpers/index");
const Khoa = require("../models/Khoa");
const LichKham = require("../models/DanhSachKham");
function DoctorController() {
  this.home = async (req, res) => {
    const { id } = req.authenticatedUser.userId;
    const nhanvien = NhanVien.findOne({ MaTK: id });

    return successResponse(req, res, {
      id: nhanvien._id,
      Ten: nhanvien.HoTen,
      GioiTinh: nhanvien.GioiTinh,
      Khoa: Khoa.findOne({ _id: nhanvien.MaCV })
        ? Khoa.findOne({ _id: nhanvien.MaCV })
        : "khoa không tồn tại!",
      NgayLam: LichKham.findOne({ MaNV: nhanvien._id })
        ? LichKham.findOne({ MaNV: nhanvien._id })
        : "Bác sĩ không có lịch khám!",
    });
  };

  this.getAllhsba = async (req, res) => {
    const { id } = req.authenticatedUser.userId;
  };
  this.getAllphieukham = async (req, res) => {
    const { id } = req.authenticatedUser.userId;
  };

  this.listDoctors = async (req, res) => {
    const { userId } = req.params;
  };
}
const listDoctors = async (req, res) => {
  try {
    const { departmentId } = req.params;

    let lstDoctors = await NhanVien.find({ MaKhoa: departmentId, MaCV: '6690fd36ff2ee427f702b83f' })

    return successResponse(req, res, [...lstDoctors]);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
module.exports = { listDoctors };
