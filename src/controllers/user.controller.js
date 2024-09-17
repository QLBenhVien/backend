const bcrypt = require("bcryptjs");
const TaiKhoan = require("../models/account.model");
const { message } = require("antd");
const BenhNhan = require("../models/BenhNhan");
const Khoa = require("../models/Khoa");
const LickKham = require("../models/LichKham");
const NhanVien = require("../models/NhanVien");
const ThongBao = require("../models/ThongBao");
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

module.exports.Capnhapthongtin = async (req, res, next) => {
  const { Email, Ten, NgaySinh, DiaChi, SDT, GioiTinh, CCCD } = req.body;

  if (!Email) {
    return res
      .status(400)
      .json({ message: "email is required to update information." });
  }

  try {
    const updatedUser = await BenhNhan.findOneAndUpdate(
      { Email: Email },
      {
        Ten: Ten,
        NgaySinh: NgaySinh,
        DiaChi: DiaChi,
        SDT: SDT,
        GioiTinh: GioiTinh,
        CCCD: CCCD,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User information updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
      KhoaID: MaKhoa._id,
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
module.exports.laylaimk = async (req, res, next) => {
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
