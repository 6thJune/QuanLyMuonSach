const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema({
    TenSach: { type: String, required: true },
    DonGia: { type: Number, required: true },
    SoQuyen: { type: Number, required: true },
    NamXuatBan: { type: Number, required: true },
    MaNXB: {
        type: mongoose.Types.ObjectId,
        ref: 'NHAXUATBAN',
        required: true
    },
    TacGia: { type: String, required: true }
});

const SACH = mongoose.model('SACH', sachSchema);

module.exports = SACH;