<script>
import axios from 'axios';

export default {
    data() {
        return {
            staffList: [],
            errorMessage: ''
        };
    },
    async created() {
        await this.fetchStaff();
    },
    methods: {
        async fetchStaff() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/staff', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.staffList = response.data;
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Lỗi khi tải danh sách nhân viên!';
            }
        },
        async deleteStaff(id) {
            if (!confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) return;
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`/api/staff/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.staffList = this.staffList.filter(staff => staff._id !== id);
                alert('Xóa nhân viên thành công!');
            } catch (error) {
                alert('Xóa nhân viên thất bại!');
            }
        }
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-3">Quản lý Nhân viên</h2>
        <router-link to="/staff/add" class="btn btn-success mb-3">Thêm Nhân Viên</router-link>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Mã NV</th>
                    <th>Họ Tên</th>
                    <th>Chức Vụ</th>
                    <th>Địa Chỉ</th>
                    <th>Số Điện Thoại</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="staff in staffList" :key="staff.MSNV">
                    <td>{{ staff.MSNV }}</td>
                    <td>{{ staff.HoTenNV }}</td>
                    <td>{{ staff.ChucVu }}</td>
                    <td>{{ staff.DiaChi }}</td>
                    <td>{{ staff.SoDienThoai }}</td>
                    <td>
                        <router-link :to="`/staff/edit/${staff._id}`"
                            class="btn btn-warning btn-sm mx-2">Sửa</router-link>
                        <button @click="deleteStaff(staff._id)" class="btn btn-danger btn-sm">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
