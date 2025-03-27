<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <router-link to="/" class="navbar-brand">QUẢN LÝ MƯỢN SÁCH</router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link" active-class="active-nav">Sách</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/staff" class="nav-link" active-class="active-nav">Nhân viên</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/borrow" class="nav-link" active-class="active-nav">Danh sách
                            mượn</router-link>
                    </li>
                    <li class="nav-item" v-if="isLoggedIn">
                        <button @click="logout" class="btn btn-outline-light">Đăng xuất</button>
                    </li>
                    <li class="nav-item" v-else>
                        <router-link to="/login" class="nav-link" active-class="active-nav">Đăng nhập</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            isLoggedIn: !!localStorage.getItem("token")
        };
    },
    mounted() {
        window.addEventListener("storage", this.checkLoginStatus);
        window.addEventListener("login-success", this.checkLoginStatus);
    },
    beforeUnmount() {
        window.removeEventListener("storage", this.checkLoginStatus);
        window.removeEventListener("login-success", this.checkLoginStatus);
    },
    methods: {
        checkLoginStatus() {
            this.isLoggedIn = !!localStorage.getItem("token");
        },
        logout() {
            localStorage.removeItem("token");
            this.isLoggedIn = false;
            this.$router.push("/login");
        }
    }
};
</script>

<style>
.active-nav {
    background-color: white !important;
    color: black !important;
    border-radius: 5px;
}
</style>
