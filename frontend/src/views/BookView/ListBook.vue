<script>
import axios from 'axios';

export default {
    data() {
        return {
            books: [],
            searchQuery: ''
        };
    },
    async created() {
        await this.fetchBooks();
    },
    computed: {
        filteredBooks() {
            if (!this.searchQuery.trim()) {
                return this.books;
            }
            return this.books.filter(book =>
                book.TenSach.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
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
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Chỉ có nhân viên mới được sử dụng chức năng này!');
                return;
            }

            if (!confirm('Bạn có chắc chắn muốn xóa sách này?')) return;

            try {
                await axios.delete(`/api/books/${bookId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                this.books = this.books.filter(book => book._id !== bookId);
                alert('Xóa sách thành công!');
            } catch (error) {
                console.error('Lỗi khi xóa sách:', error);
                alert('Xóa sách thất bại!');
            }
        }
    }
};
</script>

<template>
    <div class="container mt-4">
        <h2 class="mb-3">
            <i class="fa-solid fa-book"></i>
            Tất cả sách
        </h2>

        <!-- Ô tìm kiếm tự động -->
        <div class="mb-3">
            <input v-model="searchQuery" class="form-control w-50" placeholder="Tên sách..." />
        </div>

        <router-link to="/book/add" class="btn btn-success mb-3">
            <i class="fa-solid fa-plus"></i>
            Thêm Sách
        </router-link>
        
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên Sách</th>
                    <th>Tác Giả</th>
                    <th>Nhà Xuất Bản</th>
                    <th class="text-center">Số Quyển</th>
                    <th class="text-center">Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(book, index) in filteredBooks" :key="book._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ book.TenSach }}</td>
                    <td>{{ book.TacGia }}</td>
                    <td>{{ book.MaNXB?.TenNXB || 'Không xác định' }}</td>
                    <td class="text-center">{{ book.SoQuyen }}</td>
                    <td class="text-center">
                        <router-link :to="`/book/edit/${book._id}`" class="btn btn-warning btn-sm">
                            <i class="fa-solid fa-pencil"></i>
                            Sửa
                        </router-link>
                        <button @click="deleteBook(book._id)" class="btn btn-danger btn-sm mx-2">
                            <i class="fa-solid fa-trash"></i>
                            Xóa
                        </button>
                        <router-link :to="`/book/borrow/${book._id}`" class="btn btn-primary btn-sm">
                            <i class="fa-solid fa-check"></i>
                            Mượn sách
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>