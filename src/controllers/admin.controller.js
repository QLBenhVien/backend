const { successResponse, errorResponse } = require("../helpers/index");
const TaiKhoan = require("../models/account.model");
// Xem tất cả thông tin tài khoản người dùng
const allUsers = async (req, res) => {
    try {
        let lstUsers = await TaiKhoan.find({});
        let requester = req.authenticatedUser;
        return successResponse(req, res, { lstUsers });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        let user = await TaiKhoan.findById(userId);
        if (!user) {
            return errorResponse(req, res, "Không tìm thấy người dùng", 404);
        }

        Object.assign(user, updateData); // Gán dữ liệu mới cho object user
        const updatedUser = await user.save();

        return successResponse(req, res, {
            message: "Người dùng đã cập nhật thành công",
            updatedUser,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Xóa tài khoản người dùng
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        let user = await TaiKhoan.findById(userId);
        if (!user) {
            return errorResponse(req, res, "Không tìm thấy người dùng", 404);
        }

        await TaiKhoan.deleteOne({ _id: userId });

        return successResponse(req, res, {
            message: "Người dùng đã  xóa thành công",
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Vô hiệu hóa tài khoản
const disableUser = async (req, res) => {
    try {
        const { userId } = req.params;

        let user = await TaiKhoan.findById(userId);
        if (!user) {
            return errorResponse(req, res, "Không tìm thấy người dùng", 404);
        }

        user.active = false;
        await user.save();

        return successResponse(req, res, {
            message: "Người dùng đã bị vô hiệu hóa thành công",
            user,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Kích hoạt lại tài khoản
const enableUser = async (req, res) => {
    try {
        const { userId } = req.params;

        let user = await TaiKhoan.findById(userId);
        if (!user) {
            return errorResponse(req, res, "Không tìm thấy người dùng", 404);
        }

        user.active = true;
        await user.save();

        return successResponse(req, res, {
            message: "Người dùng đã được kích hoạt thành công",
            user,
        });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

module.exports = { allUsers, updateUser, deleteUser, disableUser, enableUser };
