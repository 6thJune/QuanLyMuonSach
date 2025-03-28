<script>
import axios from 'axios';

export default {
    data() {
        return {
            staffList: [],
            currentStaff: null,
            errorMessage: ''
        };
    },
    computed: {
        isLoggedIn() {
            return !!localStorage.getItem('token');
        },
        isManager() {
            return this.currentStaff && this.currentStaff.ChucVu === "Quản lý";
        }
    },
    async created() {
        if (this.isLoggedIn) {
            await this.fetchStaff();
        }
    },
    methods: {
        async fetchStaff() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/staff', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                this.staffList = response.data.staffList;
                this.currentStaff = response.data.currentStaff;
            } catch (error) {
                this.errorMessage = error.response?.data?.message || 'Lỗi khi tải danh sách nhân viên!';
            }
        },
        async deleteStaff(id) {
            if (!this.isManager) {
                alert('Bạn không có quyền xóa nhân viên!');
                return;
            }

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
        <h2 class="mb-3">
            <i class="fa-solid fa-user"></i>
            Quản lý nhân viên
        </h2>
        <div v-if="currentStaff" class="alert alert-info d-flex align-items-center">
            <p class="mb-0 fw-bold">
                <i class="fa-solid fa-circle-info"></i>
                Đang truy cập: {{ currentStaff.MSNV }} - {{ currentStaff.HoTenNV }} ({{ currentStaff.ChucVu }})
            </p>
        </div>

        <div v-if="isLoggedIn">
            <router-link v-if="isManager" to="/staff/add" class="btn btn-success mb-3">
                <i class="fa-solid fa-plus"></i>
                Thêm Nhân Viên
            </router-link>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mã NV</th>
                        <th>Họ Tên</th>
                        <th>Chức Vụ</th>
                        <th>Địa Chỉ</th>
                        <th>Số Điện Thoại</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(staff, index) in staffList" :key="staff.MSNV">
                        <td>{{ index + 1 }}</td>
                        <td>{{ staff.MSNV }}</td>
                        <td>{{ staff.HoTenNV }}</td>
                        <td>{{ staff.ChucVu }}</td>
                        <td>{{ staff.DiaChi }}</td>
                        <td>{{ staff.SoDienThoai }}</td>
                        <td>
                            <router-link
                                v-if="isManager"
                                :to="`/staff/edit/${staff._id}`"
                                class="btn btn-warning btn-sm mx-2">
                                <i class="fa-solid fa-pencil"></i>
                                Sửa
                            </router-link>
                            <button
                                v-if="isManager"
                                @click="deleteStaff(staff._id)"
                                class="btn btn-danger btn-sm">
                                <i class="fa-solid fa-trash"></i>
                                Xóa
                            </button>
                            <span v-else class="text-muted">Chỉ dành cho quản lý</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="alert alert-warning text-center">
            <h4>Chỉ có nhân viên mới được sử dụng chức năng này!</h4>
        </div>
    </div>
</template>
