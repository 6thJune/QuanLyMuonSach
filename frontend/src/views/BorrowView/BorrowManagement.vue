<script>
import axios from 'axios';

export default {
    data() {
        return {
            borrowRequests: [],
            isLoggedIn: false,
        };
    },
    async created() {
        this.checkLogin();
        await this.fetchBorrowRequests();
    },
    methods: {
        checkLogin() {
            const token = localStorage.getItem('token');
            this.isLoggedIn = !!token;
        },
        async fetchBorrowRequests() {
            try {
                const response = await axios.get('/api/borrow');
                this.borrowRequests = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách đơn mượn:', error);
            }
        },
        async approveBorrow(requestId) {
            if (!this.isLoggedIn) {
                alert('Bạn cần đăng nhập để duyệt đơn!');
                return;
            }

            if (!confirm('Bạn có chắc muốn duyệt đơn mượn này?')) return;

            try {
                await axios.put(`/api/borrow/${requestId}`);
                this.borrowRequests = this.borrowRequests.map(borrow =>
                    borrow._id === requestId ? { ...borrow, NgayMuon: new Date().toISOString() } : borrow
                );
                alert('Duyệt đơn mượn thành công!');
            } catch (error) {
                console.error('Lỗi khi duyệt đơn:', error);
                alert('Duyệt đơn thất bại!');
            }
        },
        async rejectBorrow(requestId) {
            if (!this.isLoggedIn) {
                alert('Bạn cần đăng nhập để từ chối đơn!');
                return;
            }

            if (!confirm('Bạn có chắc muốn từ chối đơn này?')) return;

            try {
                await axios.delete(`/api/borrow/${requestId}`);
                this.borrowRequests = this.borrowRequests.filter(borrow => borrow._id !== requestId);
                alert('Từ chối đơn mượn thành công!');
            } catch (error) {
                console.error('Lỗi khi từ chối đơn:', error);
                alert('Từ chối đơn thất bại!');
            }
        },
        async returnBook(requestId) {
            if (!this.isLoggedIn) {
                alert('Bạn cần đăng nhập để trả sách!');
                return;
            }

            const phone = prompt('Nhập số điện thoại đã dùng để đăng ký mượn sách:');
            if (!phone) {
                alert('Bạn cần nhập số điện thoại!');
                return;
            }

            if (!confirm('Bạn có chắc muốn trả sách này?')) return;

            try {
                await axios.put(`/api/borrow/return/${requestId}`, { DienThoai: phone });
                this.borrowRequests = this.borrowRequests.map(borrow =>
                    borrow._id === requestId ? { ...borrow, NgayTra: new Date().toISOString() } : borrow
                );
                alert('Trả sách thành công!');
            } catch (error) {
                console.error('Lỗi khi trả sách:', error);
                alert(error.response?.data?.message || 'Trả sách thất bại!');
            }
        }
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-3">
            <i class="fa-solid fa-list"></i>
            Đơn mượn sách
        </h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Tên độc giả</th>
                    <th>Tên sách</th>
                    <th>Ngày mượn</th>
                    <th>Ngày trả</th> <!-- Cột mới -->
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="borrow in borrowRequests" :key="borrow._id">
                    <td>{{ borrow.MaDocGia?.HoLot || 'Không xác định' }} {{ borrow.MaDocGia?.Ten || 'Không xác định' }}</td>
                    <td>{{ borrow.MaSach?.TenSach || 'Không xác định' }}</td>
                    <td>{{ borrow.NgayMuon ? new Date(borrow.NgayMuon).toLocaleDateString() : 'Chưa duyệt' }}</td>
                    <td>{{ borrow.NgayTra ? new Date(borrow.NgayTra).toLocaleDateString() : '-' }}</td> <!-- Ngày Trả -->
                    <td>
                        <button v-if="isLoggedIn && !borrow.NgayMuon"
                            @click="approveBorrow(borrow._id)"
                            class="btn btn-success btn-sm mx-1">
                            Duyệt
                        </button>
                        <button v-if="isLoggedIn && !borrow.NgayMuon"
                            @click="rejectBorrow(borrow._id)"
                            class="btn btn-danger btn-sm mx-1">
                            <i class="fa-solid fa-xmark"></i>
                            Từ chối
                        </button>
                        <button v-if="isLoggedIn && borrow.NgayMuon && !borrow.NgayTra"
                            @click="returnBook(borrow._id)"
                            class="btn btn-warning btn-sm mx-1">
                            <i class="fa-solid fa-check"></i>
                            Trả sách
                        </button>
                        <span v-if="borrow.NgayTra" class="text-success fw-bold">Đã trả</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
