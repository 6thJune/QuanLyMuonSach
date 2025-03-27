<script>
import axios from 'axios';

export default {
    data() {
        return {
            books: []
        };
    },
    async created() {
        await this.fetchBooks();
    },
    methods: {
        async fetchBooks() {
            try {
                const response = await axios.get('/api/books');
                this.books = response.data;
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sách:', error);
            }
        },
        async deleteBook(bookId) {
            if (!confirm('Bạn có chắc chắn muốn xóa sách này?')) return;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Vui lòng đăng nhập');
                    this.$router.push("/login");
                }
                await axios.delete(`/api/books/${bookId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.books = this.books.filter(book => book._id !== bookId);
                alert('Xóa sách thành công!');
            } catch (error) {
                console.error('Lỗi khi xóa sách:', error);
            }
        }

    }
};
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-3">Danh sách Sách</h2>
        <router-link to="/book/add" class="btn btn-success mb-3">Thêm Sách</router-link>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Tên Sách</th>
                    <th>Tác Giả</th>
                    <th>Nhà Xuất Bản</th>
                    <th>Số Quyển</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in books" :key="book._id">
                    <td>{{ book.TenSach }}</td>
                    <td>{{ book.TacGia }}</td>
                    <td>{{ book.MaNXB?.TenNXB || 'Không xác định' }}</td>
                    <td>{{ book.SoQuyen }}</td>
                    <td>
                        <router-link :to="`/book/borrow/${book._id}`" class="btn btn-primary btn-sm">Thuê</router-link>
                        <router-link :to="`/book/edit/${book._id}`"
                            class="btn btn-warning btn-sm mx-2">Sửa</router-link>
                        <button @click="deleteBook(book._id)" class="btn btn-danger btn-sm">Xóa</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
