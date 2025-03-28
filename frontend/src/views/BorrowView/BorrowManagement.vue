<script>
import axios from 'axios';

export default {
    data() {
        return {
            borrowRequests: [],
            searchResults: [],
            searchPhone: "",
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
        async searchByPhone() {
            if (!this.searchPhone.trim()) {
                alert('Vui lòng nhập số điện thoại!');
                return;
            }

            try {
                const response = await axios.get(`/api/borrow/phone/${this.searchPhone}`);
                this.searchResults = response.data;
                if (this.searchResults.length === 0) {
                    alert('Không tìm thấy đơn mượn nào với số điện thoại này!');
                }
            } catch (error) {
                console.error('Lỗi khi tra cứu đơn mượn:', error);
                alert('Không tìm thấy đơn mượn!');
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

        <!-- Tìm kiếm theo số điện thoại -->
        <div class="mb-3 d-flex justify-content-center align-items-center gap-2">
            <input v-model="searchPhone" 
                class="form-control w-50 rounded-pill px-3"
                placeholder="Số điện thoại đăng ký mượn sách..." />
            <button @click="searchByPhone" 
                    class="btn btn-primary rounded-pill px-4">
                <i class="fa-solid fa-search"></i> Tra cứu
            </button>
        </div>

        <!-- Kết quả tra cứu -->
        <div v-if="searchResults.length > 0">
            <h5 class="text-success">Kết quả tìm kiếm:</h5>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên độc giả</th>
                        <th>Tên sách</th>
                        <th>Ngày mượn</th>
                        <th>Ngày trả</th>
                        <th>Trạng thái</th>
                        <th class="text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(borrow, index) in searchResults" :key="borrow._id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ borrow.MaDocGia?.HoLot || '' }} {{ borrow.MaDocGia?.Ten || '' }}</td>
                        <td>{{ borrow.MaSach?.TenSach || 'Không xác định' }}</td>
                        <td>{{ borrow.NgayMuon ? new Date(borrow.NgayMuon).toLocaleDateString() : 'Chưa duyệt' }}</td>
                        <td>{{ borrow.NgayTra ? new Date(borrow.NgayTra).toLocaleDateString() : '-' }}</td>
                        <td v-if="borrow.NgayTra" class="text-success fw-bold">Đã trả</td>
                        <td v-else class="text-warning fw-bold">Chưa trả</td>
                        <td class="text-center">
                            <button v-if="!borrow.NgayMuon" @click="approveBorrow(borrow._id)" class="btn btn-success btn-sm">
                                <i class="fa-solid fa-check"></i> Duyệt
                            </button>
                            <button v-if="!borrow.NgayMuon" @click="rejectBorrow(borrow._id)" class="btn btn-danger btn-sm ms-2">
                                <i class="fa-solid fa-times"></i> Không duyệt
                            </button>
                            <button v-if="borrow.NgayMuon && !borrow.NgayTra" @click="returnBook(borrow._id)" class="btn btn-warning btn-sm ms-2">
                                <i class="fa-solid fa-undo"></i> Trả sách
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Danh sách tất cả đơn mượn -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên độc giả</th>
                    <th>Tên sách</th>
                    <th>Ngày mượn</th>
                    <th>Ngày trả</th>
                    <th>Trạng thái</th>
                    <th class="text-center">Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(borrow, index) in borrowRequests" :key="borrow._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ borrow.MaDocGia?.HoLot || '' }} {{ borrow.MaDocGia?.Ten || '' }}</td>
                    <td>{{ borrow.MaSach?.TenSach || 'Không xác định' }}</td>
                    <td>{{ borrow.NgayMuon ? new Date(borrow.NgayMuon).toLocaleDateString() : 'Chưa duyệt' }}</td>
                    <td>{{ borrow.NgayTra ? new Date(borrow.NgayTra).toLocaleDateString() : '-' }}</td>
                    <td v-if="borrow.NgayTra" class="text-success fw-bold">Đã trả</td>
                    <td v-else class="text-warning fw-bold">Chưa trả</td>
                    <td class="text-center">
                        <button v-if="!borrow.NgayMuon" @click="approveBorrow(borrow._id)" class="btn btn-success btn-sm">
                            <i class="fa-solid fa-check"></i> Duyệt
                        </button>
                        <button v-if="!borrow.NgayMuon" @click="rejectBorrow(borrow._id)" class="btn btn-danger btn-sm ms-2">
                            <i class="fa-solid fa-times"></i> Không duyệt
                        </button>
                        <button v-if="borrow.NgayMuon && !borrow.NgayTra" @click="returnBook(borrow._id)" class="btn btn-warning btn-sm ms-2">
                            <i class="fa-solid fa-undo"></i> Trả sách
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>    
    </div>
</template>
