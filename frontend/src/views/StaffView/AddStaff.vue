<script>
import axios from 'axios';

export default {
    data() {
        return {
            MSNV: '',
            HoTenNV: '',
            Password: '',
            ChucVu: '',
            DiaChi: '',
            SoDienThoai: '',
            errorMessage: ''
        };
    },
    methods: {
        async addStaff() {
            try {
                const token = localStorage.getItem('token');
                const newStaff = {
                    MSNV: this.MSNV,
                    HoTenNV: this.HoTenNV,
                    Password: this.Password,
                    ChucVu: this.ChucVu,
                    DiaChi: this.DiaChi,
                    SoDienThoai: this.SoDienThoai
                };

                await axios.post('/api/staff', newStaff, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                alert('Thêm nhân viên thành công!');
                this.$router.push('/staff');
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Thêm nhân viên thất bại!';
            }
        }
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-3">Thêm Nhân Viên</h2>
        <form @submit.prevent="addStaff">
            <div class="mb-3">
                <label class="form-label">Mã Nhân Viên</label>
                <input type="text" v-model="MSNV" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Họ Tên</label>
                <input type="text" v-model="HoTenNV" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input type="password" v-model="Password" class="form-control" required />
            </div>

            <div class="mb-3">
                <label class="form-label">Chức Vụ</label>
                <select v-model="ChucVu" class="form-select" required>
                    <option value="" disabled>Chọn chức vụ</option>
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

            <button type="submit" class="btn btn-success">Thêm Nhân Viên</button>
            <router-link to="/staff" class="btn btn-secondary ms-2">Hủy</router-link>
        </form>
    </div>
</template>
