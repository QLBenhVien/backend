const {
  successResponse,
  errorResponse,
  validateObjectId,
} = require("../helpers/index");
const Khoa = require("../models/Khoa");
const LichDatKham = require("../models/LichDatKham");
const NhanVien = require("../models/NhanVien");
const BenhNhan = require("../models/BenhNhan");
const ChucVu = require("../models/ChucVu");
const PhieuKham = require("../models/PhieuKham")

function ReceptionistController() {
  this.scheduleappointment = async (req, res, next) => {
    try {
      const { MaBS, MaBN, MaKhoa, TrieuChung, NgayDatKham } = req.body;
      const receptionisterId = req.authenticatedUser.userId;

      // Kiểm tra tính hợp lệ của các ID
      if (!validateObjectId(MaKhoa, "Mã khoa", res)) return;
      if (!validateObjectId(MaBN, "Mã bệnh nhân", res)) return;
      if (!validateObjectId(MaBS, "Mã bác sĩ", res)) return;

      // Kiểm tra NgayDatKham có hợp lệ và là ngày trong tương lai không
      const parsedDate = Date.parse(NgayDatKham);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Ngày đặt khám không hợp lệ" });
      }

      const date = new Date(parsedDate);
      if (date <= new Date()) {
        return res
          .status(400)
          .json({ message: "Ngày đặt khám phải là ngày trong tương lai" });
      }

      // Kiểm tra sự tồn tại của MaKhoa, MaBN, và MaBS
      const khoa = await Khoa.findById(MaKhoa);
      if (!khoa) {
        return errorResponse(req, res, "Khoa không tồn tại", 404);
      }

      const benhNhan = await BenhNhan.findById(MaBN);
      if (!benhNhan) {
        return errorResponse(req, res, "Bệnh nhân không tồn tại", 404);
      }

      let hasBS = false;
      if (MaBS && MaBS.trim() !== "") {
        const bacSi = await NhanVien.findById(MaBS).populate("MaCV");
        if (!bacSi) {
          return errorResponse(req, res, "Bác sĩ này không tồn tại", 404);
        }
        if (bacSi.MaCV && bacSi.MaCV.TenCV === "Bác Sĩ") {
          hasBS = true;
        } else {
          return errorResponse(req, res, "Nhân viên không phải là bác sĩ", 400);
        }
      }

      // Lấy ngày và tính SoThuTuKham
      const dateStart = new Date(date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(date);
      dateEnd.setHours(23, 59, 59, 999);

      const lastLichKham = await LichDatKham.findOne({
        NgayDatKham: { $gte: dateStart, $lte: dateEnd },
      }).sort({ SoThuTuKham: -1 });

      let sttKham = lastLichKham ? lastLichKham.SoThuTuKham + 1 : 1;

      // Tạo lịch đặt khám mới
      const lichDatKhamMoi = new LichDatKham({
        BacSiID: hasBS ? MaBS : null,
        KhoaID: MaKhoa,
        BenhNhanID: MaBN,
        NhanVienTaoLich: receptionisterId,
        TrieuChung: TrieuChung,
        NgayDatKham: date,
        SoThuTuKham: sttKham,
      });

      await lichDatKhamMoi.save();

      if (lichDatKhamMoi.TrangThai) {
        const phieuKhamMoi = new PhieuKham({
          MaPhieu: `PK${Date.now()}`, 
          MaDanhSach: lichDatKhamMoi._id, // Tham chiếu đến lịch đặt khám vừa tạo
          MaBenhNhan: MaBN,
          MaNhanVien: receptionisterId, // Nhân viên tạo phiếu khám
          TenPhieu: "Phiếu khám bệnh", // Tên phiếu
          SoThuTuKham: sttKham,
          NgayKham: date, // Cung cấp giá trị cho NgayKham, sử dụng giá trị date từ trước
        });
  
        await phieuKhamMoi.save();
      }
  
      return successResponse(
        req,
        res,
        {
          message: "Lịch khám đã được tạo thành công",
          lichDatKham: lichDatKhamMoi,
          phieuKham: lichDatKhamMoi.TrangThai ? phieuKhamMoi : null, // Chỉ trả về phieuKham nếu trạng thái là true
        },
        201
      );
    } catch (error) {
      console.error("Error when scheduling appointment: ", error);
      return errorResponse(req, res, "Lỗi server khi tạo lịch khám.");
    }
  };


  this.approveappointment = async (req, res) => {
    try {
      const { appointmentID } = req.params;
      const receptionisterId = req.authenticatedUser.userId;
  
      // Kiểm tra tính hợp lệ của các ID
      if (!validateObjectId(appointmentID, "Mã cuộc hẹn", res)) return;
  
      // Kiểm tra xem cuộc hẹn có tồn tại không
      const appointment = await LichDatKham.findById(appointmentID);
      if (!appointment) {
        return errorResponse(req, res, "Lịch khám này không tồn tại", 404);
      }
  
      // Cập nhật trạng thái của lịch khám
      appointment.TrangThai = true;
      await appointment.save();
  
      // Tạo phiếu khám nếu trạng thái là true
      const phieuKhamMoi = new PhieuKham({
        MaPhieu: `PK${Date.now()}`, 
        MaDanhSach: appointment._id, 
        MaBenhNhan: appointment.BenhNhanID, 
        MaNhanVien: receptionisterId, 
        TenPhieu: "Phiếu khám bệnh", 
        SoThuTuKham: appointment.SoThuTuKham, 
        NgayKham: appointment.NgayDatKham, 
      });
  
      await phieuKhamMoi.save();
  
      return successResponse(
        req,
        res,
        {
          message: "Lịch khám đã được xác nhận thành công và phiếu khám đã được tạo.",
          lichDatKham: appointment,
          phieuKham: phieuKhamMoi, // Trả về phiếu khám đã tạo
        },
        200
      );
    } catch (error) {
      return errorResponse(req, res, "Lỗi server khi xác nhận lịch khám.");
    }
  };
  

  this.cancelappointment = async (req, res) => {
    try {
      const { appointmentID } = req.params;
      const receptionisterId = req.authenticatedUser.userId;
      // Kiểm tra tính hợp lệ của các ID
      if (!validateObjectId(appointmentID, "Mã cuộc hẹn", res)) return;
      // Kiểm tra xem MaBN có tồn tại trong bảng NhanVien hay không
      const appointment = await LichDatKham.findById(appointmentID);
      if (!appointment) {
        return errorResponse(req, res, "Lịch khám này không tồn tại", 404);
      }

      appointment.TrangThai = false;
      // Cập nhật tượng vào cơ sở dữ liệu
      await appointment.save();
      // Trả về phản hồi thành công
      return successResponse(
        req,
        res,
        {
          message: "Lịch khám đã được hủy thành công",
          lichDatKham: appointment,
        },
        200
      );
    } catch (error) {
      // Xử lý lỗi và trả về phản hồi lỗi
      return errorResponse(req, res, "Lỗi server khi xác nhận lịch khám.");
    }
  };

  this.updateAppointment = async (req, res) => {
    try {
      const { appointmentID } = req.params;
      const receptionisterId = req.authenticatedUser.userId;
      // Kiểm tra tính hợp lệ của các ID
      if (!validateObjectId(appointmentID, "Mã cuộc hẹn", res)) return;

      const { action } = req.body; // Lấy hành động từ body (action: "approve" hoặc "cancel")
      if (!["approve", "cancel"].includes(action)) {
        return errorResponse(req, res, "Hành động không hợp lệ", 400);
      }

      // Kiểm tra xem MaBN có tồn tại trong bảng LichDatKham hay không
      const appointment = await LichDatKham.findById(appointmentID);
      if (!appointment) {
        return errorResponse(req, res, "Lịch khám này không tồn tại", 404);
      }
      let returnMsg = "";
      // Xử lý dựa trên hành động
      if (action === "approve") {
        // Xử lý duyệt lịch hẹn
        appointment.TrangThai = true;
        returnMsg = "xác nhận";
      } else if (action === "cancel") {
        // Xử lý hủy lịch hẹn
        appointment.TrangThai = false;
        returnMsg = "hủy";
      }
      await appointment.save();
      return successResponse(
        req,
        res,
        {
          message: `Lịch khám đã được ${returnMsg} thành công`,
          lichDatKham: appointment,
        },
        200
      );
    } catch (error) {
      return errorResponse(req, res, "Lỗi server khi xác nhận lịch khám.");
    }
  };

  return this;
}

module.exports = ReceptionistController();
