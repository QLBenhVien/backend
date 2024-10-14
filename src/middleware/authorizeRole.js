function authorizeRole(requiredRole) {
    return (req, res, next) => {
        if (req.authenticatedUser.role === requiredRole) {
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
