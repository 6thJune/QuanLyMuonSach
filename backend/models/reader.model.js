const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    NgaySinh: { type: String, required: true },
    Phai: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác'],
        required: true
    },
    DiaChi: { type: String, required: true },
    DienThoai: { type: String, required: true }
});

const DOCGIA = mongoose.model('DOCGIA', docGiaSchema);

module.exports = DOCGIA;