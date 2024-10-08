const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
    TenThuoc: { type: String, required: true },
    DonViTinh: { type: String, required: true },
    SoLuong: { type: Number, required: true },
});

const medicalRecordSchema = new mongoose.Schema({
    MaBenhNhan: { type: mongoose.Schema.Types.ObjectId, ref: "BenhNhan", required: true },
    ThongTinBenhNhan: { 
        Ten: { type: String, required: true },
        Tuoi: { type: Number, required: true },
        GioiTinh: { type: String, required: true },
        DiaChi: { type: String, required: true },
    },
    TenBacSi: { type: String, required: true },
    ChanDoan: { type: String, required: true },
    DonThuocs: [prescriptionSchema],
}, { timestamps: true });

const BenhAn = mongoose.model("BenhAn", medicalRecordSchema);
module.exports = BenhAn;

