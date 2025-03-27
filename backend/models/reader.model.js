const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
    HoLot: { type: String, required: true },
    Ten: { type: String, required: true },
    NgaySinh: { type: Date },
    Phai: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác'],
        required: true
    },
    DiaChi: { type: String },
    DienThoai: { type: String }
});

const DOCGIA = mongoose.model('DOCGIA', docGiaSchema);

module.exports = DOCGIA;