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
    const userId = req.authenticatedUser.userId;
    console.log("userId:", userId);
    const benhNhan = await BenhNhan.findOne({ accountId: userId });

    if (!benhNhan) {
      return errorResponse(req, res, "Không tìm thấy thông tin tài khoản", 404);
    }

    return successResponse(req, res, {
      message: "Thông tin tài khoản của bạn",
      benhNhan,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}
//Cập nhật thông tin người dùng 
module.exports.updateMyAccountInfo = async (req, res) => {
  try {
    const userId =  req.authenticatedUser.userId;
    const updateData = req.body;
    const updatedBenhNhan = await BenhNhan.findOneAndUpdate(
      { accountId: userId },
      {
        Ten: updateData.Ten || null,
        DiaChi: updateData.DiaChi || null,
        CCCD: updateData.CCCD || null,
        GioiTinh: updateData.GioiTinh || null,
        SDT: updateData.SDT || null,
      },
      { new: true, runValidators: true } // Trả về tài liệu đã cập nhật và chạy các xác thực
    );

    if (!updatedBenhNhan) {
      return errorResponse(req, res, "Không tìm thấy thông tin tài khoản để cập nhật", 404);
    }

    return successResponse(req, res, {
      message: "Thông tin tài khoản đã được cập nhật thành công",
      benhNhan: updatedBenhNhan,
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
        return res.status(400).json({ message: "Số điện thoại phải có 10 số và chỉ chứa các chữ số." });
      }
      if (CCCD && (CCCD.length !== 12 || !/^\d+$/.test(CCCD))) {
        return res.status(400).json({ message: "CCCD phải có 9 số và chỉ chứa các chữ số." });
      }
  
      // Tìm tài khoản bằng email
      const account = await TaiKhoan.findOne({ email: Email });
      if (!account) {
        return res.status(404).json({ message: "Tài khoản không tồn tại." });
      }
  
      // Kiểm tra bệnh nhân đã tồn tại
      const existingPatient = await BenhNhan.findOne({ $or: [{ SDT }, { CCCD }] });
      if (existingPatient) {
        return res.status(409).json({ message: "Số điện thoại hoặc CCCD đã tồn tại." });
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
        accountId: account._id // Lưu accountId từ TaiKhoan
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
            return res.status(400).json({ message: "CCCD, email hoặc số điện thoại là bắt buộc." });
        }

        // Tìm hồ sơ bệnh nhân dựa trên CCCD, email hoặc số điện thoại
        const query = {};
        if (CCCD) query.CCCD = CCCD;
        if (Email) query.Email = Email;
        if (SDT) query.SDT = SDT;

        const patient = await BenhNhan.findOne(query);
        
        if (!patient) {
            return res.status(404).json({ message: "Không tìm thấy hồ sơ bệnh nhân." });
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

//cập nhật hồ sơ dựa vào CCCD và SĐT đã tạo trước đó
module.exports.updatePatientProfile = async (req, res) => {
  try {
      const { CCCD, SDT, updatedData } = req.body; // Dữ liệu mới để cập nhật

      // Kiểm tra dữ liệu đầu vào
      if (!CCCD || !SDT) {
          return res.status(400).json({ message: "CCCD và số điện thoại là bắt buộc." });
      }

      // Tìm hồ sơ bệnh nhân dựa trên CCCD và SDT
      const patient = await BenhNhan.findOne({ CCCD, SDT });

      if (!patient) {
          return res.status(404).json({ message: "Không tìm thấy hồ sơ bệnh nhân với CCCD và số điện thoại đã cho." });
      }

      // Cập nhật thông tin bệnh nhân
      Object.assign(patient, updatedData); // Cập nhật các trường được cung cấp

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


//đặt lịch khám
module.exports.datKham = async (req, res) => {
  try {
      const { TrieuChung, email, tenBacSi, tenKhoa, NgayDatKham } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!TrieuChung || !email || !tenBacSi || !tenKhoa) {
          return res.status(400).json({ message: "Tất cả các trường là bắt buộc." });
      }

      // Kiểm tra định dạng Ngày Đặt Khám nếu có
      if (NgayDatKham) {
          const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(NgayDatKham);
          if (!isValidDate) {
              return res.status(400).json({
                  message: "Định dạng Ngày Đặt Khám không hợp lệ. Vui lòng sử dụng định dạng 'YYYY-MM-DD'. Ví dụ: '2024-10-10'."
              });
          }
      }

      // Tìm bệnh nhân
      const patient = await BenhNhan.findOne({ Email: email });
      if (!patient) {
          return res.status(400).json({ message: "Bệnh nhân không tồn tại." });
      }
      const BenhNhanID = patient._id; // Lấy ID bệnh nhân

      // Tìm bác sĩ
      const doctor = await NhanVien.findOne({ HoTen: tenBacSi });
      if (!doctor) {
          return res.status(400).json({ message: "Bác sĩ không tồn tại." });
      }
      const BacSiID = doctor._id; // Lấy ID bác sĩ

      // Tìm nhân viên (có thể là nhân viên hiện tại, ví dụ qua token)
      const nhanVien = await NhanVien.findOne({ /* điều kiện tìm kiếm nhân viên */ });
      if (!nhanVien) {
          return res.status(400).json({ message: "Nhân viên không tồn tại." });
      }
      const NhanVienTaoLich = nhanVien._id; // Lấy ID nhân viên

      // Tìm khoa
      const department = await Khoa.findOne({ tenkhoa: tenKhoa });
      if (!department) {
          return res.status(400).json({ message: "Khoa không tồn tại." });
      }
      const KhoaID = department._id; // Lấy ID khoa

      // Tạo một lịch hẹn mới
      const newLichDatKham = new LichDatKham({
          BacSiID,
          BenhNhanID,
          NhanVienTaoLich,
          KhoaID,
          TrieuChung,
          NgayDat: new Date(NgayDatKham || Date.now()), // Nếu không có NgayDatKham, sử dụng ngày hiện tại
          TrangThai: false // Nếu cần
      });

      // Lưu lịch hẹn vào cơ sở dữ liệu
      const savedLichDatKham = await newLichDatKham.save();

      // Phản hồi với lịch hẹn đã tạo
      res.status(201).json({
          message: "Đặt lịch khám thành công.",
          lichDatKham: savedLichDatKham,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};




//xem thông tin lịch đặt khám (tìm từ CCCD,SĐT và Email)
module.exports.xemLichKham = async (req, res) => {
  try {
      const { CCCD, SDT, Email } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!CCCD || !SDT || !Email) {
          return res.status(400).json({ message: "CCCD, số điện thoại và email là bắt buộc." });
      }

      // Tìm bệnh nhân
      const patient = await BenhNhan.findOne({ CCCD, SDT, Email });
      if (!patient) {
          return res.status(404).json({ message: "Không tìm thấy bệnh nhân với thông tin đã cho." });
      }

      // Lấy ID bệnh nhân
      const BenhNhanID = patient._id;

      // Tìm lịch hẹn dựa trên ID bệnh nhân
      const appointments = await LichDatKham.find({ BenhNhanID });
      if (!appointments || appointments.length === 0) {
          return res.status(404).json({ message: "Không có lịch hẹn nào được tìm thấy." });
      }

      // Phản hồi với danh sách lịch hẹn
      res.status(200).json({
          message: "Danh sách lịch hẹn đã được tìm thấy.",
          appointments,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

//Cập nhật thông tin lịch khám (check thông tin từ CCCD,SĐT và email)
module.exports.capNhatLichKham = async (req, res) => {
  try {
      const { CCCD, SDT, Email, updatedData } = req.body;

      // Kiểm tra dữ liệu đầu vào
      if (!CCCD || !SDT || !Email || !updatedData) {
          return res.status(400).json({ message: "CCCD, SDT, Email và thông tin cập nhật là bắt buộc." });
      }

      // Tìm bệnh nhân
      const patient = await BenhNhan.findOne({ CCCD, SDT, Email });
      if (!patient) {
          return res.status(404).json({ message: "Không tìm thấy bệnh nhân với thông tin đã cho." });
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