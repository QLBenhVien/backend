const { successResponse, errorResponse } = require("../helpers/index");
const Khoa = require("../models/Khoa");
// Xem tất cả thông tin tài khoản người dùng
const listDepartments = async (req, res) => {
    try {
        let lstDepartments = await Khoa.find({}); 
        return successResponse(req, res, [...lstDepartments]);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};
module.exports = { listDepartments };
