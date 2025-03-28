<script>
import axios from "axios";

export default {
    data() {
        return {
            maSo: "",
            password: "",
            errorMessage: ""
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post("/api/staff/login", {
                    MSNV: this.maSo,
                    Password: this.password
                });
                localStorage.setItem("token", response.data.token);
                window.dispatchEvent(new Event("login-success"));
                this.$router.push("/");
            } catch (error) {
                this.errorMessage = "Đăng nhập thất bại! Vui lòng kiểm tra lại.";
            }
        }
    }
};
</script>


<template>
    <div class="container mt-5">
        <h2 class="text-center">Đăng Nhập</h2>
        <div class="row justify-content-center">
            <div class="col-md-4">
                <form @submit.prevent="login" class="border rounded-3 p-5">
                    <div class="mb-3">
                        <label class="form-label">Mã nhân viên (VD: NV123)</label>
                        <input type="text" v-model="maSo" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mật khẩu</label>
                        <input type="password" v-model="password" class="form-control" required />
                    </div>
                    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
                    <button type="submit" class="btn btn-primary w-100">Đăng Nhập</button>
                </form>
            </div>
        </div>
    </div>
</template>
