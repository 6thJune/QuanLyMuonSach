<script>
import axios from 'axios';

export default {
    data() {
        return {
            bookId: null,
            TenSach: '',
            TacGia: '',
            MaNXB: '',
            SoQuyen: '',
            NamXuatBan: '',
            DonGia: '',
            publishers: [],
            errorMessage: '',
            successMessage: ''
        };
    },
    async created() {
        this.bookId = this.$route.params.id;
        await this.fetchPublishers();
        await this.fetchBookDetails();
    },
    methods: {
        async fetchPublishers() {
            try {
                const response = await axios.get('/api/publishers');
                this.publishers = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách nhà xuất bản:', error);
            }
        },
        async fetchBookDetails() {
            try {
                const response = await axios.get(`/api/books/${this.bookId}`);
                const book = response.data;
                this.TenSach = book.TenSach;
                this.TacGia = book.TacGia;
                this.MaNXB = book.MaNXB;
                this.SoQuyen = book.SoQuyen;
                this.NamXuatBan = book.NamXuatBan;
                this.DonGia = book.DonGia;
            } catch (error) {
                console.error('Lỗi khi lấy thông tin sách:', error);
                this.errorMessage = 'Không thể tải dữ liệu sách!';
            }
        },
        async updateBook() {
            try {
                const token = localStorage.getItem('token');
                const updatedBook = {
                    TenSach: this.TenSach,
                    TacGia: this.TacGia,
                    MaNXB: this.MaNXB,
                    SoQuyen: parseInt(this.SoQuyen, 10),
                    NamXuatBan: parseInt(this.NamXuatBan, 10),
                    DonGia: parseFloat(this.DonGia)
                };

                await axios.put(`/api/books/${this.bookId}`, updatedBook, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                this.successMessage = 'Cập nhật sách thành công!';

                setTimeout(() => {
                    this.$router.push('/');
                }, 1000);
            } catch (error) {
                if (error.response?.data?.message === "Token không hợp lệ") {
                    alert("Vui lòng đăng nhập");
                    this.$router.push('/login');
                }
            }
        }
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-3">Chỉnh Sửa Sách</h2>
        <form @submit.prevent="updateBook">
            <div class="mb-3">
                <label class="form-label">Tên Sách</label>
                <input type="text" v-model="TenSach" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Tác Giả</label>
                <input type="text" v-model="TacGia" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Nhà Xuất Bản</label>
                <select v-model="MaNXB" class="form-select" required>
                    <option value="" disabled>Chọn nhà xuất bản</option>
                    <option v-for="publisher in publishers" :key="publisher._id" :value="publisher._id">
                        {{ publisher.TenNXB }}
                    </option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Số Quyển</label>
                <input type="number" v-model="SoQuyen" class="form-control" min="1" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Năm Xuất Bản</label>
                <input type="number" v-model="NamXuatBan" class="form-control" min="1900" max="2099" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Đơn Giá</label>
                <input type="number" v-model="DonGia" class="form-control" min="0" step="1000" required />
            </div>

            <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-success">{{ successMessage }}</p>

            <button type="submit" class="btn btn-primary">Lưu Thay Đổi</button>
            <router-link to="/" class="btn btn-secondary ms-2">Hủy</router-link>
        </form>
    </div>
</template>
