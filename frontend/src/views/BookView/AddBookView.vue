<script>
import axios from 'axios';

export default {
    data() {
        return {
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
        await this.fetchPublishers();
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
        async addBook() {
            try {
                const token = localStorage.getItem('token');
                const newBook = {
                    TenSach: this.TenSach,
                    TacGia: this.TacGia,
                    MaNXB: this.MaNXB,
                    SoQuyen: parseInt(this.SoQuyen, 10),
                    NamXuatBan: parseInt(this.NamXuatBan, 10),
                    DonGia: parseFloat(this.DonGia)
                };

                const response = await axios.post('/api/books', newBook, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                this.successMessage = 'Thêm sách thành công!';
                this.resetForm();

                setTimeout(() => {
                    this.$router.push('/');
                }, 1000);
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Thêm sách thất bại!';
            }
        },
        resetForm() {
            this.TenSach = '';
            this.TacGia = '';
            this.MaNXB = '';
            this.SoQuyen = '';
            this.NamXuatBan = '';
            this.DonGia = '';
            this.errorMessage = '';
        }
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-3">Thêm Sách</h2>
        <form @submit.prevent="addBook">
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

            <button type="submit" class="btn btn-success">Thêm Sách</button>
            <router-link to="/" class="btn btn-secondary ms-2">Hủy</router-link>
        </form>
    </div>
</template>
