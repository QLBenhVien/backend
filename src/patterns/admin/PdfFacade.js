const { generateAndUploadPDF } = require("../../services/pdf/pdfGenerator");
class FdfFacade {
  constructor(benhnhan, khoa, phieukham, bacsi, phieuKhamMoi) {
    this.benhnhan = benhnhan;
    this.khoa = khoa;
    this.phieukham = phieukham;
    this.bacsi = bacsi;
    this.phieuKhamMoi = phieuKhamMoi;
  }
  async generateFDF() {
    const pdfData = {
      tenbenhnhan: this.benhnhan.Ten,
      gioitinh: this.benhnhan.GioiTinh,
      diachi: this.benhnhan.DiaChi,
      ngaysinh: this.benhnhan.NgaySinh,
      khoa: this.khoa.Tenkhoa,
      ngaydatkham: this.phieukham.NgayDatKham.toLocaleDateString(),
      tenbacsi: this.bacsi.HoTen,
      stt: this.phieuKhamMoi.SoThuTuKham,
      ca: this.phieukham.CaKham,
      trieuchung: this.phieukham.TrieuChung,
    };
    const pdfUrl = await generateAndUploadPDF(pdfData, "phieukham");
    console.log("URL pdf: ", pdfUrl);
    // this.phieuKhamMoi.pdf_url = pdfUrl;
    return pdfUrl;
  }
}

module.exports = FdfFacade;
