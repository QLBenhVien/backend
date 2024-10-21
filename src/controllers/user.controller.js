const bcrypt = require("bcryptjs");
const TaiKhoan = require("../models/account.model");
const { message } = require("antd");
const BenhNhan = require("../models/BenhNhan");
const { successResponse, errorResponse } = require("../helpers/index");
const Khoa = require("../models/Khoa");
const LickKham = require("../models/LichDatKham");
const NhanVien = require("../models/NhanVien");
const ThongBao = require("../models/ThongBao");
const LichDatKham = require("../models/LichDatKham");
const ChucVu = require("../models/ChucVu");
const DanhSachKham = require("../models/DanhSachKham");
const PhieuKham = require("../models/PhieuKham");
module.exports.hello = async (req, res) => {
  res.json("day laf duong link /user");
};

module.exports.dangkyTK = async (req, res, next) => {
  try {
    const { email, password, username, role } = req.body;
    if (role === null) {
      const userData = new TaiKhoan(req.body);
      console.log(userData);
      console.log(email);
      const userExist = await TaiKhoan.findOne({ email });

      if (userExist) {
        return res.status(400).json({ message: "User already exits." });
      }

      // Mã hóa mật khẩu trước khi lưu
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      const saveUser = await userData.save();

      const newBenhNhan = new BenhNhan({
        Ten: username,
        Email: email,
        accountId: saveUser._id,
      });

      const saveBenhNhan = await newBenhNhan.save();
      res.status(200).json({
        message: "User registered successfully",
        taiKhoan: saveUser,
        benhNhan: saveBenhNhan,
      });
    } else if (role === "NV") {
      const userData = new TaiKhoan(req.body);
      console.log(userData);
      console.log(email);
      const userExit = await TaiKhoan.findOne({ email });

      if (userExit) {
        return res.status(400).json({ message: "User already exits." });
      }

      // Mã hóa mật khẩu trước khi lưu
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      const saveUser = await userData.save();

      const newNhanVien = new NhanVien({
        HoTen: username,
        Email: email,
        MaTK: saveUser._id,
      });

      const saveNhanVien = await newNhanVien.save();
      res.status(200).json({
        message: "User registered successfully",
        taiKhoan: saveUser,
        NhanVien: saveNhanVien,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "internal sever error" });
  }
};

module.exports.dangnhap = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (role === "KH") {
      console.log(email, password);
      const user = await TaiKhoan.findOne({ email });

      if (!user) {
        res.status(400).json({ message: "user does not exits" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "invalid password." });
      }
      const idTK = user.id;
      const benhnhan = await BenhNhan.findOne({ accountId: idTK });
      res.status(200).json({ message: "login successfil", data: benhnhan });
    } else if (role === "NV") {
      console.log("check nv");
      console.log(email, password, role);
      const user = await TaiKhoan.findOne({ email });

      if (!user) {
        console.log;
        res.status(400).json({ message: "user does not exits" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "invalid password." });
      }
      const idTK = user.id;
      const nhanVien = await NhanVien.findOne({ MaTK: idTK });
      res.status(200).json({ message: "login successfil", data: nhanVien });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

module.exports.home = async (req, res, next) => {};

//Xem thông tin người dùng
module.exports.getMyAccountInfo = async (req, res) => {
  try {
    const idTK = req.authenticatedUser.userId;
    const myTK = await TaiKhoan.findOne({ _id: idTK });

    if (!myTK) {
      return errorResponse(req, res, "Không tìm thấy thông tin tài khoản", 404);
    }

    console.log(myTK);
    return successResponse(
      req,
      res,
      {
        message: "Thông tin tài khoản của bạn",
        myTK,
      },
      200
    );
  } catch (error) {
    console.log(error);
    return errorResponse(req, res, error.message, 500);
  }
};
//Cập nhật thông tin người dùng
module.exports.updateMyAccountInfo = async (req, res) => {
  try {
    const userId = req.authenticatedUser.userId;
    const updateData = req.body;
    const updatedTaiKhoan = await TaiKhoan.findOneAndUpdate(
      { _id: userId },
      {
        username: updateData.username,
      },
      { new: true, runValidators: true } // Trả về tài liệu đã cập nhật và chạy các xác thực
    );

    if (!updatedTaiKhoan) {
      return errorResponse(
        req,
        res,
        "Không tìm thấy thông tin tài khoản để cập nhật",
        404
      );
    }
    console.log("TaiKhoan da update:", updatedTaiKhoan);

    return successResponse(req, res, {
      message: "Thông tin tài khoản đã được cập nhật thành công",
      Taikhoan: updatedTaiKhoan,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

//////////////////////////////Dangkykhambenh/////////////////////////////////////////

// page dang ky khambenh / bacsi
// localhost:8080/user/dangkykhambenh/theobacsi
module.exports.Theobacsi = async (req, res, next) => {
  const {} = req.body;
};

// page dang ky khambenh / ngay -> ket qua tra ve la khoa
// localhost:8080/user/dangkykhambenh/theongay
module.exports.Theongay = async (req, res, next) => {
  try {
    const khoas = await Khoa.find();
    res.status(200).json({ dataKhoa: khoas });
  } catch (error) {
    res.status(500).json({ message: "Error fetching khoa information", error });
  }
};

module.exports.Datkham = async (req, res, next) => {
  try {
    const { TenNV, MaBN, TenKhoa, NgayDat } = req.body;

    const MaKhoa = await Khoa.findOne({ tenkhoa: TenKhoa });

    const MaNV = await NhanVien.findOne({ HoTen: "NgocDuyIT" });

    const LickKhamnew = new LickKham({
      NhanVienID: MaNV._id,
      BenhNhanID: MaBN,
      // KhoaID: MaKhoa._id,
      NgayDat: NgayDat,
    });

    const saveLichKham = await LickKhamnew.save();

    const ThongBaonew = new ThongBao({
      TieuDe: "Đặt lịch thành công",
    });

    ThongBaonew.save();

    res.status(200).json({
      message: "Lichkham registered successfully",
      LichKham: saveLichKham,
    });
  } catch (error) {
    console.log(error);
  }
};
//////////////////////////////////////////////////////////////////////////////////

// thong bao
module.exports.thongbao = async (req, res, next) => {
  try {
    const dataThongBao = await ThongBao.find();
    res.status(200).json({ data: dataThongBao });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// phieu kham

//nhan vien
// cap nhap thong tin nhan vien

//lay lai mat khau
module.exports.Resetpassword = async (req, res, next) => {
  try {
    const { email, matkhau } = req.body;
    console.log("email and password: ", email, matkhau);
    // Find the email in the database
    const Email = await TaiKhoan.findOne({ email });

    if (!Email) {
      return res.status(400).json("Email không tồn tại");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(matkhau, salt);

    // Update the password in the database
    const updatedTK = await TaiKhoan.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedTK) {
      return res.status(500).json("Lỗi hệ thống");
    }

    // Send a successful response
    res.status(200).json("Request successful");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};

//tạo hồ sơ bệnh nhân
module.exports.createPatientProfile = async (req, res) => {
  try {
    const { Ten, NgaySinh, DiaChi, GioiTinh, SDT, CCCD, Email } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!Ten || !Email) {
      return res.status(400).json({ message: "Tên và email là bắt buộc." });
    }
    if (SDT && (SDT.length !== 10 || !/^\d+$/.test(SDT))) {
      return res.status(400).json({
        message: "Số điện thoại phải có 10 số và chỉ chứa các chữ số.",
      });
    }
    if (CCCD && (CCCD.length !== 12 || !/^\d+$/.test(CCCD))) {
      return res
        .status(400)
        .json({ message: "CCCD phải có 9 số và chỉ chứa các chữ số." });
    }

    // Tìm tài khoản bằng email
    const account = await TaiKhoan.findOne({ email: Email });
    if (!account) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    // Kiểm tra bệnh nhân đã tồn tại
    const existingPatient = await BenhNhan.findOne({
      $or: [{ SDT }, { CCCD }],
    });
    if (existingPatient) {
      return res
        .status(409)
        .json({ message: "Số điện thoại hoặc CCCD đã tồn tại." });
    }

    // Tạo hồ sơ bệnh nhân mới
    const newPatient = new BenhNhan({
      Ten,
      NgaySinh: NgaySinh || null, // Đặt giá trị mặc định nếu không có
      DiaChi: DiaChi || null,
      GioiTinh: GioiTinh || null,
      SDT: SDT || null,
      CCCD: CCCD || null,
      Email, // Lưu Email từ req.body
      accountId: account._id, // Lưu accountId từ TaiKhoan
    });

    // Lưu hồ sơ bệnh nhân mới
    const savedPatient = await newPatient.save();

    // Phản hồi
    res.status(201).json({
      message: "Hồ sơ bệnh nhân đã được tạo thành công",
      patient: savedPatient, // Gửi hồ sơ bệnh nhân đã lưu
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

//Tìm hồ sơ bệnh nhân (tìm theo cccd,email hoặc số điện thoại)
module.exports.findPatientProfile = async (req, res) => {
  try {
    const { CCCD, Email, SDT } = req.query;

    // Kiểm tra ít nhất một trong các thông tin đã được cung cấp
    if (!CCCD && !Email && !SDT) {
      return res
        .status(400)
        .json({ message: "CCCD, email hoặc số điện thoại là bắt buộc." });
    }

    // Tìm hồ sơ bệnh nhân dựa trên CCCD, email hoặc số điện thoại
    const query = {};
    if (CCCD) query.CCCD = CCCD;
    if (Email) query.Email = Email;
    if (SDT) query.SDT = SDT;

    const patient = await BenhNhan.findOne(query);

    if (!patient) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hồ sơ bệnh nhân." });
    }

    // Trả về thông tin hồ sơ bệnh nhân
    res.status(200).json({
      message: "Hồ sơ bệnh nhân đã được tìm thấy.",
      patient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

// lấy tất cả thông tin hồ sơ benhnhan
module.exports.getAllinfoHS = async (req, res) => {
  try {
    const userId = req.authenticatedUser.userId;
    console.log("userId:", userId);

    const benhNhan = await BenhNhan.findOne({ accountId: userId });
    if (!benhNhan) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin bệnh nhân",
      });
    }

    console.log("benhnhan:", benhNhan);
    return successResponse(
      req,
      res,
      {
        message: "Thành công",
        benhNhan,
      },
      200
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};
//cập nhật hồ sơ benhnhan
module.exports.updatePatientProfile = async (req, res) => {
  console.log(req.body.data);
  try {
    const userId = req.authenticatedUser.userId;
    const { data } = req.body; // Lấy dữ liệu từ req.body.data

    // Kiểm tra nếu người dùng đã đăng nhập
    if (!userId) {
      return res.status(400).json({ message: "Yêu cầu đăng nhập!" });
    }

    // Tìm hồ sơ bệnh nhân theo ID tài khoản
    let patient = await BenhNhan.findOne({ accountId: userId });

    if (!patient) {
      return res.status(404).json({
        message: "Không tìm thấy hồ sơ bệnh nhân",
      });
    }

    // Cập nhật thông tin bệnh nhân chỉ với những trường có trong yêu cầu
    patient.Ten = data.Ten || patient.Ten;
    patient.NgaySinh = data.NgaySinh || patient.NgaySinh;
    patient.DiaChi = data.DiaChi || patient.DiaChi;
    patient.CCCD = data.CCCD || patient.CCCD;
    patient.CCCD_ngayCap = data.CCCD_ngayCap || patient.CCCD_ngayCap;
    patient.CCCD_noiCap = data.CCCD_noiCap || patient.CCCD_noiCap;
    patient.GioiTinh = data.GioiTinh || patient.GioiTinh;
    patient.SDT = data.SDT || patient.SDT;
    patient.Email = data.Email || patient.Email;
    patient.Job = data.Job || patient.Job;
    patient.BHYT = data.BHYT || patient.BHYT;

    // Lưu hồ sơ đã cập nhật
    const updatedPatient = await patient.save();

    // Phản hồi với thông tin đã cập nhật
    res.status(200).json({
      message: "Hồ sơ bệnh nhân đã được cập nhật thành công.",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

//xem dat kham
module.exports.getInfoDatKham = async (req, res) => {
  try {
    const userId = req.authenticatedUser.userId;
    console.log("userId :", userId);
    console.log("getinfodatkham");

    // Tìm bệnh nhân dựa trên accountId
    const benhNhan = await BenhNhan.findOne({ accountId: userId });

    // Kiểm tra nếu không tìm thấy bệnh nhân
    if (!benhNhan) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin bệnh nhân với userId đã cho.",
      });
    }

    // Lấy tất cả các khoa
    const khoa = await Khoa.find({});

    // Kiểm tra nếu không có khoa nào được tìm thấy
    if (!khoa || khoa.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bất kỳ khoa nào.",
      });
    }

    const idBacsi = await ChucVu.findOne({ TenCV: "Bác Sĩ" });
    console.log(idBacsi._id);
    const bacsi = await NhanVien.find({ MaCV: idBacsi._id });

    console.log(bacsi);

    // Nếu mọi thứ thành công, trả về thông tin
    return successResponse(req, res, {
      message: "Thành công",
      benhNhan,
      khoa,
      bacsi,
    });
  } catch (error) {
    console.error("Lỗi xảy ra:", error);
    return errorResponse(req, res, error.message);
  }
};

// tìm lịch khám của bác sĩ
module.exports.timlichkham = async (req, res) => {
  try {
    const { BacSiID } = req.body;
    if (!BacSiID) {
      return res.status(400).json({ message: "Yêu cầu chọn bác sĩ" });
    }
    const DanhSachKhams = await DanhSachKham.find({ MaNV: BacSiID });
    console.log(DanhSachKhams);
    return successResponse(req, res, {
      message: "Thành công",
      lichkham: DanhSachKhams,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

//huy lịch khám
module.exports.huylichdat = async (req, res) => {
  try {
    const { idlichdat } = req.body;

    if (!idlichdat) {
      return res.status(400).json({ message: "Phiếu đặt khám không tồn tại" });
    }

    console.log(idlichdat);
    const deletedAppointment = await LichDatKham.findByIdAndDelete({
      _id: idlichdat,
    });

    if (!deletedAppointment) {
      return res.status(404).json({ message: "Lịch đặt khám không tồn tại" });
    }

    console.log(`Lịch đặt khám có ID ${idlichdat} đã bị hủy.`);
    return res
      .status(200)
      .json({ message: "Lịch đặt khám đã được hủy thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};
// Đặt lịch khám
module.exports.datKham = async (req, res) => {
  try {
    const { MaNV, MaBN, MaKhoa, NgayDat, CaKham, TrieuChung } = req.body;
    console.log(req.body);

    // Kiểm tra dữ liệu đầu vào
    if (!MaNV || !MaBN || !MaKhoa || !NgayDat) {
      return res
        .status(400)
        .json({ message: "Tất cả các trường là bắt buộc." });
    }

    // Kiểm tra định dạng Ngày Đặt Khám

    // Tìm bệnh nhân
    const patient = await BenhNhan.findById(MaBN);
    if (!patient) {
      return res.status(404).json({ message: "Bệnh nhân không tồn tại." });
    }
    const BenhNhanID = patient._id; // Lấy ID bệnh nhân

    // Tìm bác sĩ
    const doctor = await NhanVien.findById(MaNV);
    if (!doctor) {
      return res.status(404).json({ message: "Bác sĩ không tồn tại." });
    }
    const BacSiID = doctor._id; // Lấy ID bác sĩ

    // Tìm khoa
    const department = await Khoa.findById(MaKhoa);
    if (!department) {
      return res.status(404).json({ message: "Khoa không tồn tại." });
    }
    const KhoaID = department._id; // Lấy ID khoa

    // Tạo một lịch hẹn mới
    const newLichDatKham = new LichDatKham({
      BacSiID,
      KhoaID,
      BenhNhanID,
      TrieuChung,
      NgayDatKham: new Date(NgayDat),
      CaKham: CaKham,
      TrangThai: false,
      SoThuTuKham: null, // Số thứ tự khám có thể được đặt giá trị ở nơi khác
    });

    // Lưu lịch hẹn vào cơ sở dữ liệu
    const savedLichDatKham = await newLichDatKham.save();

    console.log("lich kham da dat:", newLichDatKham);
    // Phản hồi với lịch hẹn đã tạo
    res.status(201).json({
      message: "Đặt lịch khám thành công.",
      lichDatKham: savedLichDatKham,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ", error: error.message });
  }
};

//xem thông tin lịch đặt khám (tìm từ CCCD,SĐT và Email)
module.exports.xemLichKham = async (req, res) => {
  try {
    const userId = req.authenticatedUser?.userId;

    // Kiểm tra dữ liệu đầu vào
    if (!userId) {
      return res.status(400).json({ message: "Vui lòng đăng nhập lại!" });
    }

    // Tìm bệnh nhân
    const patient = await BenhNhan.findOne({ accountId: userId });
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bệnh nhân với thông tin đã cho." });
    }

    // Lấy ID bệnh nhân
    const BenhNhanID = patient._id;
    const BenhNhanTen = patient.Ten;
    console.log(BenhNhanID);

    // Tìm lịch hẹn dựa trên ID bệnh nhân
    const appointments = await LichDatKham.find({ BenhNhanID });
    if (!appointments || appointments.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có lịch hẹn nào được tìm thấy." });
    }

    // ten benh nhan

    // Phản hồi với danh sách lịch hẹn
    return res.status(200).json({
      message: "Danh sách lịch hẹn đã được tìm thấy.",
      lichkham: appointments,
      TenBN: BenhNhanTen,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};
// xem chi tiet lich kham
module.exports.xemchitietLichKham = async (req, res) => {
  try {
    const { idLichKham } = req.body;
    const userId = req.authenticatedUser?.userId;

    // Kiểm tra dữ liệu đầu vào
    if (!userId) {
      return res.status(400).json({ message: "Vui lòng đăng nhập lại!" });
    }

    // Tìm bệnh nhân
    const patient = await BenhNhan.findOne({ accountId: userId });
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bệnh nhân với thông tin đã cho." });
    }

    // Lấy ID bệnh nhân
    const BenhNhanID = patient._id;
    const BenhNhanTen = patient.Ten;
    console.log(BenhNhanID);

    // Tìm lịch hẹn dựa trên ID lịch hẹn
    const appointment = await LichDatKham.findOne({ _id: idLichKham });
    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Không có lịch hẹn nào được tìm thấy." });
    }

    // Tìm tên bác sĩ
    const doctor = await NhanVien.findOne({ _id: appointment.BacSiID });
    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bác sĩ với thông tin đã cho." });
    }

    // Phản hồi với chi tiết lịch hẹn
    return res.status(200).json({
      message: "Chi tiết lịch hẹn đã được tìm thấy.",
      lichkham: appointment,
      TenBN: BenhNhanTen,
      TenBS: doctor.HoTen,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

//Cập nhật thông tin lịch khám (check thông tin từ CCCD,SĐT và email)
module.exports.capNhatLichKham = async (req, res) => {
  try {
    const { CCCD, SDT, Email, updatedData } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!CCCD || !SDT || !Email || !updatedData) {
      return res.status(400).json({
        message: "CCCD, SDT, Email và thông tin cập nhật là bắt buộc.",
      });
    }

    // Tìm bệnh nhân
    const patient = await BenhNhan.findOne({ CCCD, SDT, Email });
    if (!patient) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bệnh nhân với thông tin đã cho." });
    }

    // Lấy ID bệnh nhân
    const BenhNhanID = patient._id;

    // Tìm lịch hẹn dựa trên ID bệnh nhân
    const appointment = await LichDatKham.findOne({ BenhNhanID });
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn nào." });
    }

    // Cập nhật thông tin lịch hẹn với dữ liệu từ updatedData
    if (updatedData.TenBacSi) {
      const doctor = await NhanVien.findOne({ HoTen: updatedData.TenBacSi });
      if (doctor) {
        appointment.BacSiID = doctor._id; // Cập nhật ID bác sĩ
      }
    }

    if (updatedData.NgayDatKham) {
      appointment.NgayDatKham = updatedData.NgayDatKham; // Cập nhật ngày đặt khám
    }

    if (updatedData.TrieuChung) {
      appointment.TrieuChung = updatedData.TrieuChung; // Cập nhật triệu chứng
    }

    const updatedAppointment = await appointment.save();

    // Phản hồi với lịch hẹn đã được cập nhật
    res.status(200).json({
      message: "Cập nhật lịch hẹn thành công.",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};
//Tìm bác sĩ (tìm theo HoTen và Tenkhoa)
module.exports.timKiemNhanVien = async (req, res) => {
  try {
    const { HoTen, Tenkhoa } = req.query;

    if (!HoTen && !Tenkhoa) {
      return res.status(400).json({
        message:
          "Phải cung cấp ít nhất một trong các tham số: HoTen hoặc Tenkhoa.",
      });
    }

    let query = {};

    // Nếu người dùng nhập HoTen
    if (HoTen) {
      query.HoTen = { $regex: new RegExp(HoTen.trim(), "i") };
    }

    // Nếu người dùng nhập Tenkhoa
    let khoaId;
    if (Tenkhoa) {
      const khoa = await Khoa.findOne({
        Tenkhoa: { $regex: new RegExp(Tenkhoa.trim(), "i") },
      });
      if (!khoa) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy khoa với tên đã cho." });
      }
      khoaId = khoa._id;
    }

    // Tìm tất cả nhân viên theo query
    const nhanViens = await NhanVien.find(query);

    // Nếu chỉ tìm theo HoTen và không có bác sĩ nào
    if (!Tenkhoa && nhanViens.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bác sĩ với tên đã cho." });
    }

    // Nếu có Tenkhoa, kiểm tra xem bác sĩ có thuộc khoa đó không
    if (khoaId) {
      const nhanViensInKhoa = nhanViens.filter(
        (nv) => nv.MaKhoa && nv.MaKhoa.toString() === khoaId.toString()
      );

      if (nhanViensInKhoa.length === 0) {
        return res.status(404).json({
          message: `Không tồn tại bác sĩ "${HoTen}" trong khoa "${Tenkhoa}".`,
        });
      }
    }

    // Phản hồi với kết quả tìm kiếm
    res.status(200).json({
      message: "Kết quả tìm kiếm thành công.",
      data: nhanViens,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

// xem phieu kham
module.exports.xemphieukham = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const phieukham = await PhieuKham.findOne({ MaDanhSach: id });
    const benhnhan = await BenhNhan.findOne({ _id: phieukham.MaBenhNhan });
    console.log(benhnhan);
    console.log(phieukham);
    const bacsi = await NhanVien.findOne({ _id: phieukham.MaNhanVien });
    console.log(bacsi);
    return successResponse(
      req,
      res,
      {
        message: "Thành công",
        data: {
          tenbn: benhnhan.Ten,
          gioitinh: benhnhan.GioiTinh,
          ngaysinh: benhnhan.NgaySinh,
          sdt: benhnhan.SDT,
          diachi: benhnhan.DiaChi,
          tenbs: bacsi.HoTen,
          ngaykham: phieukham.NgayKham,
          cakham: phieukham.CaKham,
          sttKham: phieukham.SoThuTuKham,
        },
      },
      200
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

//test them danh sach kham cua bac si , day la test khoong phai cua user
module.exports.themlichlam = async (req, res) => {
  try {
    const { MaNV, NgayKham, Ca } = req.body;
    const DanhSachKhams = new DanhSachKham({
      MaNV: MaNV,
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

// ket thuc
