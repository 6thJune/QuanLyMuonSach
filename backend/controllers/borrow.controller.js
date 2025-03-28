const TheoDoiMuonSach = require('../models/borrowing.model');
const DocGia = require('../models/reader.model');
const Sach = require('../models/book.model'); // Import model sách

exports.getAllBorrow = async (req, res) => {
    try {
        const borrow = await TheoDoiMuonSach.find().populate('MaDocGia').populate('MaSach');
        res.status(200).json(borrow);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách mượn', error });
    }
};

exports.borrowRequest = async (req, res) => {
    try {
        const { MaSach, MaDocGia, HoLot, Ten, NgaySinh, Phai, DiaChi, DienThoai } = req.body;

        // Kiểm tra xem có yêu cầu mượn chưa duyệt nào không
        const existingRequest = await TheoDoiMuonSach.findOne({ MaDocGia, MaSach, NgayMuon: null });
        if (existingRequest) {
            return res.status(400).json({ message: 'Yêu cầu mượn sách đã tồn tại, vui lòng chờ duyệt!' });
        }

        // Kiểm tra xem sách có tồn tại không
        const book = await Sach.findById(MaSach);
        if (!book) {
            return res.status(404).json({ message: 'Không tìm thấy sách!' });
        }

        // Kiểm tra số lượng sách còn không
        if (book.SoQuyen <= 0) {
            return res.status(400).json({ message: 'Sách đã hết, không thể mượn!' });
        }

        // Giảm số lượng sách khi gửi yêu cầu mượn
        book.SoQuyen -= 1;
        await book.save();

        // Kiểm tra xem độc giả đã tồn tại chưa
        let reader = await DocGia.findById(MaDocGia);
        if (!reader) {
            reader = new DocGia({
                _id: MaDocGia,
                HoLot,
                Ten,
                NgaySinh,
                Phai,
                DiaChi,
                DienThoai
            });
            await reader.save();
        }

        // Tạo yêu cầu mượn sách mới
        const newRequest = new TheoDoiMuonSach({ MaDocGia, MaSach });
        await newRequest.save();

        res.json({ message: 'Gửi yêu cầu mượn sách thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

exports.approveBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        const borrowRequest = await TheoDoiMuonSach.findById(id);
        if (!borrowRequest) {
            return res.status(404).json({ message: 'Không tìm thấy đơn mượn!' });
        }

        // Cập nhật ngày mượn
        borrowRequest.NgayMuon = new Date();
        await borrowRequest.save();

        res.json({ message: 'Duyệt đơn mượn sách thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

exports.rejectBorrow = async (req, res) => {
    try {
        const { id } = req.params;

        const borrowRequest = await TheoDoiMuonSach.findById(id);
        if (!borrowRequest) {
            return res.status(404).json({ message: 'Không tìm thấy đơn mượn!' });
        }

        const readerId = borrowRequest.MaDocGia;
        const bookId = borrowRequest.MaSach;

        // Xóa đơn mượn
        await TheoDoiMuonSach.findByIdAndDelete(id);

        // Cộng lại số sách nếu đơn bị từ chối
        const book = await Sach.findById(bookId);
        if (book) {
            book.SoQuyen += 1;
            await book.save();
        }

        // Kiểm tra nếu độc giả không có đơn mượn nào khác thì xóa độc giả
        const otherBorrows = await TheoDoiMuonSach.findOne({ MaDocGia: readerId });
        if (!otherBorrows) {
            await DocGia.findByIdAndDelete(readerId);
        }

        res.json({ message: 'Từ chối đơn mượn sách thành công, số lượng sách được phục hồi và xóa độc giả nếu không có đơn khác!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { DienThoai } = req.body; // Nhận số điện thoại từ frontend

        if (!DienThoai) {
            return res.status(400).json({ message: 'Vui lòng nhập số điện thoại!' });
        }

        // Tìm đơn mượn và populate thông tin độc giả
        const borrowRequest = await TheoDoiMuonSach.findById(id).populate('MaDocGia');
        if (!borrowRequest || !borrowRequest.NgayMuon) {
            return res.status(404).json({ message: 'Không tìm thấy đơn mượn hợp lệ!' });
        }

        // Kiểm tra số điện thoại
        if (borrowRequest.MaDocGia.DienThoai !== DienThoai) {
            return res.status(400).json({ message: 'Số điện thoại không khớp với đơn mượn!' });
        }

        // Cập nhật ngày trả sách
        borrowRequest.NgayTra = new Date();
        await borrowRequest.save();

        // Cập nhật số lượng sách trong kho
        const book = await Sach.findById(borrowRequest.MaSach);
        if (book) {
            book.SoQuyen += 1;
            await book.save();
        }

        res.json({ message: 'Trả sách thành công!' });
    } catch (error) {
        console.error('Lỗi khi trả sách:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
};
