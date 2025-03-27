exports.verifyManager = (req, res, next) => {
    if (!req.staff || req.staff.ChucVu !== "Quản lý") {
        return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
    }
    next();
};