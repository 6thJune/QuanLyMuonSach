const NHAXUATBAN = require('../models/publisher.model');

exports.getAllPublisher = async (req, res) => {
    try {
        const publishers = await NHAXUATBAN.find();
        res.status(200).json(publishers);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà xuất bản', error });
    }
};