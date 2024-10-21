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
const PhieuKham = require("../models/PhieuKham");

function ReceptionistController() {
  this.home = async (req, res) => {
    try {
      const receptionisterId = req.authenticatedUser.userId;
      const infoNhanvien = await NhanVien.findOne({ MaTK: receptionisterId });
      if (!infoNhanvien) {
        return errorResponse(req, res, "Không tìm thấy nhân viên!", 404);
      }
      return successResponse(
        req,
        res,
        {
          message: "Thành công",
          data: {
            name: infoNhanvien.HoTen,
            role: req.authenticatedUser,
            gender: infoNhanvien.GioiTinh,
            id: infoNhanvien._id,
          },
        },
        200
      );
    } catch (error) {
      console.error("Error when scheduling appointment: ", error);
      return errorResponse(req, res, "Lỗi server", 500);
    }
  };
  // đặt lịch
  this.scheduleappointment = async (req, res, next) => {
    try {
      const { MaBS, MaBN, MaKhoa, TrieuChung, NgayDatKham } = req.body;
      // const receptionisterId = req.authenticatedUser.userId;

      // Kiểm tra tính hợp lệ của các ID
      if (!validateObjectId(MaKhoa, "Mã khoa", res)) return;
      // if (!validateObjectId(MaBN, "Mã bệnh nhân", res)) return;
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

      let benhNhanIdNew;
      if (MaBN == null) {
        const { TenBN, NgaySinhBN, GioiTinhBN, SDTBN, DiaChiBN } = req.body;
        const existingPatient = await BenhNhan.findOne({ SDT: SDTBN });
        if (existingPatient) {
          return res.status(200).json({ message: "Số điện thoại này đã tồn tại" });
        } 
        let benhNhanNew = new BenhNhan({
          Ten: TenBN,
          NgaySinh: NgaySinhBN,
          GioiTinh: GioiTinhBN,
          SDT: SDTBN,
          DiaChi: DiaChiBN,
        });
        await benhNhanNew.save();
        benhNhanIdNew = benhNhanNew._id;
      }
      // Kiểm tra sự tồn tại của MaKhoa, MaBN, và MaBS
      const khoa = await Khoa.findById(MaKhoa);
      if (!khoa) {
        return errorResponse(req, res, "Khoa không tồn tại", 404);
      }

      // const benhNhan = await BenhNhan.findById(MaBN);
      // if (!benhNhan) {
      //   return errorResponse(req, res, "Bệnh nhân không tồn tại", 404);
      // }

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
        BenhNhanID: MaBN == null ? benhNhanIdNew : MaBN,
        // NhanVienTaoLich: receptionisterId,
        TrieuChung: TrieuChung,
        NgayDatKham: date,
        SoThuTuKham: sttKham,
      });
      // const lichDatKhamMoi = new LichDatKham({
      //   BacSiID: hasBS ? MaBS : null,
      //   KhoaID: MaKhoa,
      //   BenhNhanID: MaBN,
      //   NhanVienTaoLich: receptionisterId,
      //   TrieuChung: TrieuChung,
      //   NgayDatKham: date,
      //   SoThuTuKham: sttKham,
      // });

      // await lichDatKhamMoi.save();

      if (lichDatKhamMoi.TrangThai) {
        const phieuKhamMoi = new PhieuKham({
          MaPhieu: `PK${Date.now()}`,
          MaDanhSach: lichDatKhamMoi._id, // Tham chiếu đến lịch đặt khám vừa tạo
          MaBenhNhan: MaBN == null ? benhNhanIdNew : MaBN,
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
      const { id } = req.params;
      const receptionisterId = req.authenticatedUser.userId;
      console.log(id);

      const appointment = await LichDatKham.findOne({ _id: id });
      if (!appointment) {
        return errorResponse(req, res, "Lịch khám này không tồn tại", 404);
      }

      const bacsi = await NhanVien.findOne({ _id: appointment.BacSiID });

      const ngayDatKham = appointment.NgayDatKham;

      const lichKhams = await LichDatKham.find({
        BenhNhanID: appointment.BenhNhanID,
        NgayDatKham: {
          $gte: new Date(ngayDatKham.setHours(0, 0, 0, 0)), // Bắt đầu từ 00:00:00
          $lt: new Date(ngayDatKham.setHours(23, 59, 59, 999)), // Kết thúc đến 23:59:59
        },
      });

      // Tính số thứ tự khám mới
      const soThuTuKham =
        lichKhams.length > 0
          ? Math.max(...lichKhams.map((lich) => lich.SoThuTuKham)) + 1
          : 1;

      // Cập nhật trạng thái của lịch khám
      appointment.TrangThai = true;
      appointment.SoThuTuKham = soThuTuKham; // Cập nhật số thứ tự khám
      await appointment.save();

      // Tạo phiếu khám nếu trạng thái là true
      const phieuKhamMoi = new PhieuKham({
        MaPhieu: `PK${Date.now()}`,
        MaDanhSach: appointment._id,
        MaBenhNhan: appointment.BenhNhanID,
        MaNhanVien: bacsi._id,
        TenPhieu: "Phiếu khám bệnh",
        SoThuTuKham: appointment.SoThuTuKham,
        NgayKham: appointment.NgayDatKham,
      });

      await phieuKhamMoi.save();

      return successResponse(
        req,
        res,
        {
          message:
            "Lịch khám đã được xác nhận thành công và phiếu khám đã được tạo.",
          lichDatKham: appointment,
          phieuKham: phieuKhamMoi, // Trả về phiếu khám đã tạo
        },
        200
      );
    } catch (error) {
      console.error(error); // Log lỗi để kiểm tra
      return errorResponse(req, res, "Lỗi server khi xác nhận lịch khám.");
    }
  };

  // huy lich kham
  this.cancelappointment = async (req, res) => {
    try {
      const { id } = req.body;
      console.log(id);

      // Kiểm tra xem lịch khám có tồn tại hay không
      const appointment = await LichDatKham.findById(id);
      if (!appointment) {
        return errorResponse(req, res, "Lịch khám này không tồn tại", 400);
      }

      // Cập nhật trạng thái hủy
      appointment.DaHuy = true; // Đánh dấu là đã hủy
      await appointment.save(); // Lưu thay đổi vào cơ sở dữ liệu

      return successResponse(
        req,
        res,
        {
          message: "Lịch khám đã được hủy thành công",
        },
        200
      );
    } catch (error) {
      console.error(error); // Log lỗi để kiểm tra
      return errorResponse(req, res, "Lỗi server khi xác nhận lịch khám.", 500);
    }
  };

  // cap nhap lich kham
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

  // list all lich kham
  this.listLichdat = async (req, res) => {
    try {
      // Lấy ngày hiện tại
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ, phút, giây, mili giây về 0 để so sánh chỉ theo ngày

      // Tìm các lịch hẹn có NgayDatKham >= hôm nay và TrangThai là false
      const dataDatkham = await LichDatKham.find({
        TrangThai: false,
        NgayDatKham: { $gte: today }, // Chỉ lấy lịch hẹn từ hôm nay trở đi
        DaHuy: false,
      }).populate({
        path: "BenhNhanID", // Trường liên kết với bảng BenhNhan
        select: "Ten", // Chỉ lấy trường Ten của BenhNhan
      });;

      // const datakham = [];

      // for (const dat of dataDatkham) {
      //   const benhNhan = await BenhNhan.findOne({ _id: dat.BenhNhanID });
      //   datakham.push({
      //     id: dat._id,
      //     idBn: dat.BenhNhanID,
      //     TenBN: benhNhan ? benhNhan.Ten : "Không tìm thấy bệnh nhân", // Lấy tên bệnh nhân nếu tìm thấy
      //     NgayDat: dat.NgayDatKham,
      //     TrangThai: dat.TrangThai,
      //   });
      // }

      return successResponse(req, res, { Datkham: dataDatkham }, 200);
    } catch (error) {
      console.error(error); // Log lỗi để kiểm tra
      return errorResponse(req, res, "Lỗi server", 500);
    }
  };

  this.detailAppointment = async (req, res) => {
    const { id } = req.params;
    try {
      console.log(id);
      const appointment = await LichDatKham.findOne({ _id: id });

      const BacSi = await NhanVien.findOne({ _id: appointment.BacSiID });
      const BenhNhannew = await BenhNhan.findOne({
        _id: appointment.BenhNhanID,
      });
      // const Khoanew = await Khoa.findOne({
      //   _id: appointment.KhoaID,
      // });

      return successResponse(
        req,
        res,
        {
          detailDatkham: {
            TenBN: BenhNhannew.Ten,
            GioiTinh: BenhNhannew.GioiTinh,
            MaBN: BenhNhannew._id,
            TenBS: BacSi.HoTen,
            NgayHen: appointment.NgayDatKham,
            Ca: appointment.CaKham,
            DiaChi: BenhNhannew.DiaChi,
            TrieuChung: appointment.TrieuChung,
            SDT: BenhNhannew.SDT,
          },
        },
        200
      );
    } catch (error) {
      console.error(error); // Log lỗi để kiểm tra
      return errorResponse(req, res, "Lỗi server", 500);
    }
  };

  this.listAppointment = async (req, res) => {
    let { dateStart, dateEnd } = req.body; // Lấy từ body

    // Nếu không truyền dateStart và dateEnd, thiết lập mặc định
    const currentDate = new Date();

    if (!dateStart && !dateEnd) {
      const currentDate = new Date();
      dateStart = currentDate.toISOString().split("T")[0]; // Ngày hiện tại
    
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + 7);
      dateEnd = futureDate.toISOString().split("T")[0]; // 7 ngày sau
    } else if (!dateStart) {
      dateStart = new Date(dateEnd); // Nếu chỉ có dateEnd, sử dụng nó để tính dateStart
      dateStart.setDate(dateStart.getDate() - 7); // Lấy 7 ngày trước dateEnd
      dateStart = dateStart.toISOString().split("T")[0];
    } else if (!dateEnd) {
      dateEnd = currentDate.toISOString().split("T")[0]; // Nếu chỉ có dateStart, sử dụng ngày hiện tại cho dateEnd
    }

    try {
      // Tìm lịch hẹn trong khoảng thời gian
      const listAppointment = await LichDatKham.find({
        TrangThai: true,
        NgayDatKham: {
          $gte: new Date(dateStart),
          $lte: new Date(dateEnd),
        },
      }).populate({
        path: "BenhNhanID", // Trường liên kết với bảng BenhNhan
        select: "Ten", // Chỉ lấy trường Ten của BenhNhan
      });

      return successResponse(
        req,
        res,
        {
          listAppointment,
        },
        200
      );
    } catch (error) {
      console.error(error); // Log lỗi để kiểm tra
      return errorResponse(req, res, "Lỗi server", 500);
    }
  };
  return this;
}

module.exports = ReceptionistController();
