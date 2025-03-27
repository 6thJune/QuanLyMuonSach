<script>
import axios from 'axios';

export default {
    data() {
        return {
            staffId: null,
            HoTenNV: '',
            ChucVu: '',
            DiaChi: '',
            SoDienThoai: '',
            errorMessage: '',
            successMessage: ''
        };
    },
    async created() {
        this.staffId = this.$route.params.id;
        await this.fetchStaffDetails();
    },
    methods: {
        async fetchStaffDetails() {
            try {
                const response = await axios.get(`/api/staff/${this.staffId}`);
                const staff = response.data;
                this.HoTenNV = staff.HoTenNV;
                this.ChucVu = staff.ChucVu;
                this.DiaChi = staff.DiaChi;
                this.SoDienThoai = staff.SoDienThoai;
            } catch (error) {
                console.error('Lỗi khi lấy thông tin nhân viên:', error);
                this.errorMessage = 'Không thể tải dữ liệu nhân viên!';
            }
        },
        async updateStaff() {
            try {
                const token = localStorage.getItem('token');
                const updatedStaff = {
                    HoTenNV: this.HoTenNV,
                    ChucVu: this.ChucVu,
                    DiaChi: this.DiaChi,
                    SoDienThoai: this.SoDienThoai
                };

                await axios.put(`/api/staff/${this.staffId}`, updatedStaff, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                this.successMessage = 'Cập nhật nhân viên thành công!';
                setTimeout(() => {
                    this.$router.push('/staff');
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
        <h2 class="mb-3">Chỉnh Sửa Nhân Viên</h2>
        <form @submit.prevent="updateStaff">
            <div class="mb-3">
                <label class="form-label">Họ Tên Nhân Viên</label>
                <input type="text" v-model="HoTenNV" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Chức Vụ</label>
                <select v-model="ChucVu" class="form-select" required>
                    <option value="Nhân viên">Nhân viên</option>
                    <option value="Quản lý">Quản lý</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Địa Chỉ</label>
                <input type="text" v-model="DiaChi" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Số Điện Thoại</label>
                <input type="text" v-model="SoDienThoai" class="form-control" required />
            </div>

            <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-success">{{ successMessage }}</p>

            <button type="submit" class="btn btn-primary">Lưu Thay Đổi</button>
            <router-link to="/staff" class="btn btn-secondary ms-2">Hủy</router-link>
        </form>
    </div>
</template>
