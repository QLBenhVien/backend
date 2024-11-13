const { successResponse, errorResponse } = require("../helpers/index");
const mongoose = require("mongoose"); // Import mongoose
const PhieuKham = require("../models/PhieuKham");
const HoaDon = require("../models/HoaDon.model");
const paypal = require("@paypal/checkout-server-sdk");
const BenhNhan = require("../models/BenhNhan");
const NhanVien = require("../models/NhanVien");
const Khoa = require("../models/Khoa");
const clientId =
  "AXAl-vVyydICzwStxvMLyA53LuFjVrRONwiZWU5kLqzjOgQGLuKWJ0ajOlzpmiYLi5ea8QrxZ9PP0TG1"; // Thay thế bằng Client ID của bạn
const clientSecret =
  "EJT5yyTPgJrsiWJerUbb4BGD2swipXXATg5ui5WAIJN5h-mn1zwqKfNTp28fg9farK7H1aFzsct59_NM"; // Thay thế bằng Secret của bạn

const { generateAndUploadPDF } = require("../services/pdf/pdfGenerator");

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Xem tất cả thông tin tài khoản người dùng
const createPaypalPayment = async (req, res) => {
  const { amount, appointmentId } = req.body; // Lấy amount từ req.body

  if (!amount || !appointmentId) {
    return res
      .status(400)
      .json({ error: "Amount and appointmentId are required" });
  }
  // Kiểm tra xem amount có được truyền từ frontend hay không
  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount, // Sử dụng amount từ req.body
        },
      },
    ],
  });

  try {
    console.log(appointmentId);
    const order = await client.execute(request);

    // Lấy thông tin bệnh nhân từ Phiếu Khám
    const phieuKham = await PhieuKham.findOne({ _id: appointmentId }); // Lấy Phiếu Khám theo ID
    console.log("Phieu kham", phieuKham);
    // Tạo hóa đơn mới
    const benhnhan = await BenhNhan.findOne({ _id: phieuKham.MaBenhNhan });

    const newHoaDon = new HoaDon({
      MaHoaDon: `HD-${new Date().getTime()}`, // Tạo MaHoaDon duy nhất, ví dụ theo thời gian
      MaPhieu: appointmentId,
      MaBenhNhan: phieuKham.MaBenhNhan,
      TongTien: amount,
    });

    await newHoaDon.save(); // Lưu hóa đơn mới
    // Cập nhật Phiếu Khám để thêm ID hóa đơn
    await PhieuKham.findOneAndUpdate(
      { _id: appointmentId }, // Tìm theo _id
      { MaHoaDon: newHoaDon._id }, // Thêm ID hóa đơn vào Phiếu Khám
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    const bacsi = await NhanVien.findOne({ _id: phieuKham.MaNhanVien });
    const khoa = await Khoa.findOne({ _id: bacsi.MaKhoa });
    const pdfData = {
      tenbenhnhan: benhnhan.Ten,
      gioitinh: benhnhan.GioiTinh,
      diachi: benhnhan.DiaChi,
      ngaysinh: benhnhan.NgaySinh,
      tenbacsi: bacsi.HoTen,
      noidung: phieuKham.ChanDoan,
      taikham: phieuKham.LoiDan,
      tenkhoa: khoa.Tenkhoa,
      tongtien: newHoaDon.TongTien,
      tiendichvu: 150000,
    };

    const pdfUrl = await generateAndUploadPDF(pdfData, "bienlai");

    await PhieuKham.findOneAndUpdate(
      { _id: appointmentId }, // Tìm theo _id
      { pdf_hoadon: pdfUrl }, // Thêm ID hóa đơn vào Phiếu Khám
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    res.json({ id: order.result.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
};

// Tạo API để cập nhật trạng thái thanh toán
const updatePaymentStatusToPaid = async (req, res) => {
  const { appointmentId } = req.body; // Nhận appointmentId từ req.body
  if (!appointmentId) {
    return res.status(400).json({ error: "Appointment ID is required" });
  }

  try {
    const phieuKham = await PhieuKham.findById(appointmentId); // Lấy Phiếu Khám theo ID
    await HoaDon.findOneAndUpdate(
      { _id: phieuKham.MaHoaDon }, // Tìm theo _id
      { TrangThaiThanhToan: "Đã Thanh Toán" }, // Thêm ID hóa đơn vào Phiếu Khám
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    res.json({ message: "Payment status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating payment status");
  }
};

module.exports = { createPaypalPayment, updatePaymentStatusToPaid };
