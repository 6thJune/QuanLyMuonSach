<script>
import axios from 'axios';
function generateObjectId() {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
export default {
    data() {
        return {
            borrowData: {
                MaSach: this.$route.params.id,
                MaDocGia: generateObjectId(),
                HoLot: '',
                Ten: '',
                NgaySinh: '',
                Phai: '',
                DiaChi: '',
                DienThoai: ''
            },
            bookName: '',
            message: ''
        };      
    },
    async created() {
        await this.fetchBookDetails();
    },
    methods: {
        async fetchBookDetails() {
            try {
                const response = await axios.get(`/api/books/${this.borrowData.MaSach}`);
                this.bookName = response.data.TenSach;
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sách:", error);
                this.bookName = "Không tìm thấy sách";
            }
        },
        async submitBorrowRequest() {
            try {
                const response = await axios.post('/api/borrow', this.borrowData);
                this.message = response.data.message;
                alert(this.message);
                this.$router.push('/');
            } catch (error) {
                console.error("Lỗi khi gửi yêu cầu mượn sách:", error);
                this.message = error.response?.data?.message || "Lỗi không xác định!";
                alert(this.message);
            }
        }
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-3">Đăng ký mượn sách: {{ bookName }}</h2>

        <form @submit.prevent="submitBorrowRequest">
            <div class="mb-3">
                <label class="form-label">Họ lót</label>
                <input v-model="borrowData.HoLot" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
                <label class="form-label">Tên</label>
                <input v-model="borrowData.Ten" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
                <label class="form-label">Ngày sinh</label>
                <input v-model="borrowData.NgaySinh" type="date" class="form-control" required />
            </div>
            <div class="mb-3">
                <label class="form-label">Giới tính</label>
                <select v-model="borrowData.Phai" class="form-control" required>
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>
            <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input v-model="borrowData.DiaChi" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input v-model="borrowData.DienThoai" type="text" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary">Gửi yêu cầu</button>
        </form>
    </div>
</template>