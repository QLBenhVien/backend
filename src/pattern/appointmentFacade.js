class AppointmentFacade {
    async createAppointment(appointmentData) {
      try {
        // Tìm kiếm thông tin Khoa & Nhân viên cùng lúc
        const [khoa, nhanVien] = await Promise.all([
          Khoa.findOne({ tenkhoa: appointmentData.TenKhoa }),
          NhanVien.findOne({ HoTen: appointmentData.TenNV })
        ]);
  
        if (!khoa) throw new Error("Department not found");
        if (!nhanVien) throw new Error("Doctor not found");
  
        // Tạo lịch khám mới
        const newLichKham = new LichKham({
          NhanVienID: nhanVien._id,
          BenhNhanID: appointmentData.MaBN,
          KhoaID: khoa._id,
          NgayDat: appointmentData.NgayDat
        });
  
        // Lưu lịch khám vào database
        const savedLichKham = await newLichKham.save();
  
        // Tạo thông báo cho bệnh nhân
        await new ThongBao({
          TieuDe: "Đặt lịch thành công",
          NoiDung: `Bạn đã đặt lịch với bác sĩ ${nhanVien.HoTen} vào ngày ${appointmentData.NgayDat}`,
          UserID: appointmentData.MaBN
        }).save();
  
        return { success: true, appointment: savedLichKham };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  }
  
  module.exports = new AppointmentFacade();
  