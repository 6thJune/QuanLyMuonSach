const mongoose = require('mongoose');

const muonSachSchema = mongoose.Schema({
    MaDocGia: {
        type: mongoose.Types.ObjectId,
        ref: 'DOCGIA',
        required: true
    },
    MaSach: {
        type: mongoose.Types.ObjectId,
        ref: 'SACH',
        required: true
    },
    NgayMuon: { type: Date, default: null },
    NgayTra: { type: Date, default: null }
})

const THEODOIMUONSACH = mongoose.model('THEODOIMUONSACH', muonSachSchema);

module.exports = THEODOIMUONSACH;