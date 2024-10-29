const TaiKhoan = require("../models/NhanVien");

function authorizeRole(requiredRole) {
  return async (req, res, next) => {
    if (req.authenticatedUser.role === requiredRole) {
      const user = await TaiKhoan.findById({
        _id: req.authenticatedUser.userID,
      });
      const isActive = user.active ? true : false;
      if (!isActive) {
        res
          .status(403)
          .send({ message: "Tài khoản của bạn đã bị vô hiệu hóa!" });
      }
      return next();
    }
    return res.status(403).send({
      message: "Tài khoản không có quyền làm điều này!",
    }); // Nếu vai trò không khớp, trả về 403
  };
}

const authorize = {
  authorizeRole: authorizeRole,
};
module.exports = authorize;
