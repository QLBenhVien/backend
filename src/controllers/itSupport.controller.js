const { successResponse, errorResponse } = require("../helpers/index");

const NhanVien = require("../models/NhanVien");
const BenhNhan = require("../models/BenhNhan");
const ChucVu = require("../models/ChucVu");

// -------------------------- NHÂN VIÊN -------------------------
// Lấy tất cả tài khoản nhân viên
const allNhanViens = async (req, res) => {
    try {
        const lstNhanViens = await NhanVien.find({});
        return successResponse(req, res, { lstNhanViens });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Thêm nhân viên
const addNhanVien = async (req, res) => {
    try {
        const nhanVienData = req.body;
        const nhanVien = new NhanVien(nhanVienData);

        await nhanVien.save();

        return successResponse(req, res, {
            message: "Nhân viên đã được thêm thành công",
            nhanVien,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Cập nhật thông tin nhân viên
const updateNhanVien = async (req, res) => {
    try {
        const { nhanVienId } = req.params;
        const updateData = req.body;

        const nhanVien = await NhanVien.findById(nhanVienId);
        if (!nhanVien) {
            return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
        }

        Object.assign(nhanVien, updateData);
        const updatedNhanVien = await nhanVien.save();

        return successResponse(req, res, {
            message: "Thông tin nhân viên đã được cập nhật thành công",
            updatedNhanVien,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Vô hiệu hóa tài khoản nhân viên
const disableNhanVien = async (req, res) => {
    try {
        const { nhanVienId } = req.params;

        const nhanVien = await NhanVien.findById(nhanVienId);
        if (!nhanVien) {
            return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
        }

        nhanVien.active = false;
        await nhanVien.save();

        return successResponse(req, res, {
            message: "Nhân viên đã bị vô hiệu hóa thành công",
            nhanVien,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Kích hoạt lại tài khoản nhân viên
const enableNhanVien = async (req, res) => {
    try {
        const { nhanVienId } = req.params;

        const nhanVien = await NhanVien.findById(nhanVienId);
        if (!nhanVien) {
            return errorResponse(req, res, "Không tìm thấy nhân viên", 404);
        }

        nhanVien.active = true;
        await nhanVien.save();

        return successResponse(req, res, {
            message: "Nhân viên đã được kích hoạt lại thành công",
            nhanVien,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// -------------------------- BỆNH NHÂN -------------------------

// Lấy tất cả tài khoản bệnh nhân
const allBenhNhans = async (req, res) => {
    try {
        const lstBenhNhans = await BenhNhan.find({});
        return successResponse(req, res, { lstBenhNhans });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Thêm bệnh nhân
const addBenhNhan = async (req, res) => {
    try {
        const benhNhanData = req.body;
        const benhNhan = new BenhNhan(benhNhanData);

        await benhNhan.save();

        return successResponse(req, res, {
            message: "Bệnh nhân đã được thêm thành công",
            benhNhan,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Vô hiệu hóa tài khoản bệnh nhân
const disableBenhNhan = async (req, res) => {
    try {
        const { benhNhanId } = req.params;

        const benhNhan = await BenhNhan.findById(benhNhanId);
        if (!benhNhan) {
            return errorResponse(req, res, "Không tìm thấy bệnh nhân", 404);
        }

        benhNhan.active = false;
        await benhNhan.save();

        return successResponse(req, res, {
            message: "Bệnh nhân đã bị vô hiệu hóa thành công",
            benhNhan,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Kích hoạt lại tài khoản bệnh nhân
const enableBenhNhan = async (req, res) => {
    try {
        const { benhNhanId } = req.params;

        const benhNhan = await BenhNhan.findById(benhNhanId);
        if (!benhNhan) {
            return errorResponse(req, res, "Không tìm thấy bệnh nhân", 404);
        }

        benhNhan.active = true;
        await benhNhan.save();

        return successResponse(req, res, {
            message: "Bệnh nhân đã được kích hoạt lại thành công",
            benhNhan,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

module.exports = {
    allNhanViens,
    addNhanVien,
    updateNhanVien,
    disableNhanVien,
    enableNhanVien,
    allBenhNhans,
    addBenhNhan,
    disableBenhNhan,
    enableBenhNhan,
};
