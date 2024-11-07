const NhanVien = require("../models/NhanVien");
const { successResponse, errorResponse } = require("../helpers/index");
const Khoa = require("../models/Khoa");
const LichKham = require("../models/DanhSachKham");
const Hosobenhan = require("../models/Hoso");
const BenhNhan = require("../models/BenhNhan");
const PhieuKham = require("../models/PhieuKham");
const Thuoc = require("../models/Thuoc.model");
const DanhSachKham = require("../models/DanhSachKham");
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
  const { id } = req.params;
  try {
    const information = await BenhNhan.findById({ id });
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

    // const benhan = await

    return successResponse(req, res, { benhnhan }, 200);
  } catch (error) {
    return errorResponse(req, res, "Lỗi hệ thống!", 500);
  }
};

//  --------------------page phieu kham benh----------------------------------

module.exports.getPhieukham = async (req, res) => {
  const { option } = req.params;
  let listPK;

  try {
    if (option === "false") {
      listPK = await PhieuKham.find({ TrangThai: false }).populate({
        path: "MaBenhNhan",
        select: "Ten",
      });
    } else if (option === "true") {
      listPK = await PhieuKham.find({ TrangThai: true }).populate({
        path: "MaBenhNhan",
        select: "Ten",
      });
    } else {
      listPK = await PhieuKham.find({ TrangThai: false }).populate({
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

// xong
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
  const { id } = req.authenticatedUser.userId;
  try {
    const { MaNV, NgayKham, Ca } = req.body;
    const DanhSachKhams = new DanhSachKham({
      MaNV: id,
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
    const danhsachkham = await DanhSachKham.findOne({ MaNV: id });
    res.status(200).json({ danhsachkham });
  } catch (error) {
    res.status(500).json({ error: "internal sever error" });
  }
};
