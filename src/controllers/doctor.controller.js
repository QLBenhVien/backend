const NhanVien = require("../models/NhanVien");
const { successResponse, errorResponse } = require("../helpers/index");
const Khoa = require("../models/Khoa");
const LichKham = require("../models/DanhSachKham");
const Hosobenhan = require("../models/Hoso");
const BenhNhan = require("../models/BenhNhan");
const PhieuKham = require("../models/PhieuKham");
const Thuoc = require("../models/Thuoc.model");
const DanhSachKham = require("../models/DanhSachKham");
const BenhAn = require("../models/BenhAn");
// function DoctorController() {
//   this.home = async (req, res) => {
//     const { id } = req.authenticatedUser.userId;
//     const nhanvien = NhanVien.findOne({ MaTK: id });

//     return successResponse(req, res, {
//       id: nhanvien._id,
//       Ten: nhanvien.HoTen,
//       GioiTinh: nhanvien.GioiTinh,
//       Khoa: Khoa.findOne({ _id: nhanvien.MaCV })
//         ? Khoa.findOne({ _id: nhanvien.MaCV })
//         : "khoa không tồn tại!",
//       NgayLam: LichKham.findOne({ MaNV: nhanvien._id })
//         ? LichKham.findOne({ MaNV: nhanvien._id })
//         : "Bác sĩ không có lịch khám!",
//     });
//   };

//   //page ho so benh an
//   this.getAllhsba = async (req, res) => {
//     try {
//       const hosobenhnhan = await Hosobenhan.find({});
//       if (!hosobenhnhan) {
//         return errorResponse(req, res, "Không có hồ sơ bệnh án nào", 204);
//       }
//       return successResponse(req, res, hosobenhnhan, 200);
//     } catch (error) {
//       return errorResponse(req, res, "Lỗi hệ thống!", 500);
//     }
//   };

//   this.getAllphieukham = async (req, res) => {
//     const { id } = req.authenticatedUser.userId;
//   };

//   this.listDoctors = async (req, res) => {
//     const { userId } = req.params;
//   };
// }

// const listDoctors = async (req, res) => {
//   try {
//     const { departmentId } = req.params;

//     let lstDoctors = await NhanVien.find({
//       MaKhoa: departmentId,
//       MaCV: "6690fd36ff2ee427f702b83f",
//     });

//     return successResponse(req, res, [...lstDoctors]);
//   } catch (error) {
//     return errorResponse(req, res, error.message);
//   }
// };

// page ho so benh an
// 1 lay tatt ca ho so benh an cua benh nhan
module.exports.getAllhsba = async (req, res) => {
  try {
    const hosobenhnhan = await Hosobenhan.find({}).populate({
      path: "MaBenhNhan",
      select: "Ten _id",
    });

    if (!hosobenhnhan || hosobenhnhan.length === 0) {
      return errorResponse(req, res, "Không có hồ sơ bệnh án nào", 204);
    }
    return successResponse(req, res, hosobenhnhan, 200);
  } catch (error) {
    console.error(error);
    return errorResponse(req, res, "Lỗi hệ thống!", 500);
  }
};

// 2. chi tiet ho so benh an
module.exports.detailHoso = async (req, res) => {
  const { id } = req.params; //id benh nhan
  try {
    const information = await BenhNhan.findOne({ _id: id });
    if (!information) {
      return errorResponse(req, res, "không tìm thấy thông tin bệnh nhân", 404);
    }
    const benhnhan = {
      MaBenhNhan: information._id,
      Ten: information.Ten,
      NgaySinh: information.NgaySinh,
      DiaChi: information.DiaChi,
      GioiTinh: information.GioiTinh,
      SDT: information.SDT,
    };

    const maHS = await Hosobenhan.findOne({ MaBenhNhan: id })._id;
    const benhan = await BenhAn.find({ MaHS: maHS });
    console.log(benhan);
    return successResponse(req, res, { benhnhan, benhan }, 200);
  } catch (error) {
    return errorResponse(req, res, "Lỗi hệ thống!", 500);
  }
};

//  --------------------page phieu kham benh----------------------------------

module.exports.getPhieukham = async (req, res) => {
  const id = req.authenticatedUser.userId;
  const { option } = req.params;
  let listPK;

  try {
    const Nhanvien = await NhanVien.findOne({ MaTK: id }); // Sử dụng findOne để lấy một đối tượng

    if (option === "false") {
      listPK = await PhieuKham.find({
        TrangThai: false,
        MaNhanVien: Nhanvien._id,
      }).populate({
        path: "MaBenhNhan",
        select: "Ten",
      });
    } else if (option === "true") {
      listPK = await PhieuKham.find({
        TrangThai: true,
        MaNhanVien: Nhanvien._id,
      }).populate({
        path: "MaBenhNhan",
        select: "Ten",
      });
    } else {
      listPK = await PhieuKham.find({
        TrangThai: false,
        MaNhanVien: Nhanvien._id,
      }).populate({
        path: "MaBenhNhan",
        select: "Ten",
      });
    }

    const thongtinphieu = listPK.map((phieu) => ({
      id: phieu.SoThuTuKham,
      idPhieu: phieu._id,
      // idBenhNhan: phieu.MaBenhNhan ? phieu.MaBenhNhan._id : null,
      tenBenhNhan: phieu.MaBenhNhan ? phieu.MaBenhNhan.Ten : null,
      ngayKham: phieu.NgayKham,
      caKham: phieu.CaKham,
      tinhTrang: phieu.TrangThai,
    }));

    return successResponse(
      req,
      res,
      {
        thongtinphieu,
        links: {
          detailphieu: "/doctor/detailPhieu",
        },
      },
      200
    );
  } catch (error) {
    console.error(error);
    return errorResponse(req, res, "Lỗi hệ thống!", 500);
  }
};

module.exports.detailPhieukham = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(id);
    const detail = await PhieuKham.findOne({ _id: id })
      .populate({
        path: "MaBenhNhan",
        select: "Ten NgaySinh DiaChi GioiTinh SDT",
      })
      .populate({
        path: "Thuoc.MaThuoc",
        select: "tenthuoc",
      });

    if (!detail) {
      return errorResponse(req, res, "Không tìm thấy phiếu", 404);
    }

    return successResponse(
      req,
      res,
      { detail: detail, links: { acceptPhieu: "/doctor/endphieu" } },
      200
    );
  } catch (error) {
    console.error(error);
    return errorResponse(req, res, "Lỗi hệ thống!", 500);
  }
};

module.exports.updatePhieukham = async (req, res) => {
  const { id } = req.params;
  const { TrieuChung, ChanDoan, LoiDan, Thuoc } = req.body;
  try {
    const Phieu = await PhieuKham.findByIdAndUpdate(
      id,
      {
        TrieuChung: TrieuChung,
        ChanDoan: ChanDoan,
        LoiDan: LoiDan,
        Thuoc: Thuoc,
      },
      { new: true }
    );

    if (!Phieu) {
      return errorResponse(req, res, "Không tìm thấy phiếu khám", 404);
    }
    return successResponse(
      req,
      res,
      Phieu,

      200
    );
  } catch (error) {
    console.error(error);
    return errorResponse(req, res, "Lỗi hệ thống!", 500);
  }
};

module.exports.goiyThuoc = async (req, res) => {
  const { ten } = req.params;
  try {
    const suggestions = await Thuoc.find({
      tenthuoc: { $regex: new RegExp(ten, "i") },
    }).limit(3);
    res.json({ data: suggestions });
  } catch (error) {
    console.error(error);
    return errorResponse(req, res, "Lỗi hệ thống!", 500);
  }
};

module.exports.endPhieukham = async (req, res) => {
  const { id } = req.params;
  try {
    const phieukham = await PhieuKham.findByIdAndUpdate(
      id,
      {
        TrangThai: true,
      },
      { new: true }
    );
    if (!phieuKham) {
      return res.status(404).json({ message: "Không tìm thấy phiếu khám" });
    }
    return successResponse(req, res, phieukham, 200);
  } catch (error) {
    console.error(error);
    return errorResponse(req, res, "Lỗi hệ thống!", 500);
  }
};

//test them danh sach kham cua bac si , day la test khoong phai cua user
module.exports.themlichlam = async (req, res) => {
  const id = req.authenticatedUser.userId;
  try {
    const { NgayKham, Ca } = req.body;
    console.log(NgayKham, "Ngaykham");

    const Nhanvien = await NhanVien.findOne({ MaTK: id }); // Tìm nhân viên
    if (!Nhanvien) {
      return res.status(404).json({ error: "Nhân viên không tồn tại" });
    }

    // Kiểm tra xem ca đã được đăng ký chưa
    const existingShift = await DanhSachKham.findOne({ NgayKham, Ca });

    if (existingShift) {
      // Nếu ca đã có lịch khám, trả về thông báo lỗi
      return res.status(400).json({
        message: "Ca này đã được đăng ký trước đó",
      });
    }
    //
    // Nếu ca chưa có, tiến hành lưu ca mới
    const DanhSachKhams = new DanhSachKham({
      MaNV: Nhanvien ? Nhanvien._id : null,
      NgayKham: NgayKham,
      Ca: Ca,
    });

    const saveDanhSachKham = await DanhSachKhams.save();
    res.status(200).json({
      message: "Đăng ký lịch khám thành công",
      DanhSachKham: saveDanhSachKham,
    });
  } catch (error) {
    res.status(500).json({ error: "internal sever error" });
  }
};
module.exports.thongtinlichlam = async (req, res) => {
  const id = req.authenticatedUser.userId;
  try {
    console.log(id);
    const Nhanvien = await NhanVien.findOne({ MaTK: id });
    const danhsachkham = await DanhSachKham.find({ MaNV: Nhanvien._id });
    res.status(200).json({ danhsachkham });
  } catch (error) {
    res.status(500).json({ error: "internal sever error" });
  }
};

// xem danh sach benh nhan
module.exports.getListbenhnhan = async () => {
  try {
  } catch (error) {
    res.status(500).json({ error: "internal sever error" });
  }
};
