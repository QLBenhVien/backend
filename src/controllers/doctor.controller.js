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

const listAvailableDoctors = async (req, res) => {
  try {
    const { departmentId, ngayKham, caKham } = req.body;
    if (caKham == -1)
    {
      return successResponse(req, res, []);
    }
    // Kiểm tra xem `ngayKham` có hợp lệ không
    const date = new Date(ngayKham);
    if (isNaN(date.getTime())) {
      return errorResponse(req, res, "Ngày không hợp lệ.");
    }

    // Tạo startOfDay và endOfDay để chỉ lấy trong ngày đó
      // Thiết lập `startOfDay` và `endOfDay` theo UTC để bao quát toàn bộ ngày
      const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
      const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
  
    const doctors = await NhanVien.find({ MaKhoa: departmentId, MaCV: '6690fd36ff2ee427f702b83f' }); 
    const busyDoctors = await LichKham.find({
      NgayKham: { $gte: startOfDay, $lt: endOfDay },
      Ca: caKham
    }).select('MaNV'); // Chỉ lấy MaNV của các bác sĩ đã bận

    const busyDoctorIds = busyDoctors.map(doc => doc.MaNV.toString());

    // Lọc bác sĩ không có trong danh sách bác sĩ bận
    const availableDoctors = doctors.filter(doctor => !busyDoctorIds.includes(doctor._id.toString()));

    return successResponse(req, res, availableDoctors);
  } catch (error) {
    return errorResponse(req, res, "Đã xảy ra lỗi, vui lòng thử lại sau.");
  }
};



module.exports = { listDoctors,listAvailableDoctors };
