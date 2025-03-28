import { createWebHistory, createRouter } from "vue-router";

import ListBook from "@/views/BookView/ListBook.vue";
import AddBook from "@/views/BookView/AddBookView.vue";
import EditBook from "@/views/BookView/EditBookView.vue";
import BorrowBook from "@/views/BookView/BorrowBook.vue";

import LoginView from "@/views/StaffView/LoginView.vue";
import ListStaff from "@/views/StaffView/ListStaff.vue";
import AddStaff from "@/views/StaffView/AddStaff.vue";
import EditStaff from "@/views/StaffView/EditStaff.vue";

import BorrowManagement from "@/views/BorrowView/BorrowManagement.vue";

const routes = [
    {
        path: "/",
        name: "List book",
        component: ListBook
    },
    {
        path: "/book/add",
        name: "Add book",
        component: AddBook
    },
    {
        path: "/book/edit/:id",
        name: "Edit book",
        component: EditBook
    },
    {
        path: "/book/borrow/:id",
        name: "Borrow book",
        component: BorrowBook
    },
    {
        path: "/login",
        name: "Login",
        component: LoginView
    },
    {
        path: "/staff",
        name: "List staff",
        component: ListStaff
    },
    {
        path: "/staff/add",
        name: "Add staff",
        component: AddStaff
    },
    {
        path: "/staff/edit/:id",
        name: "Edit staff",
        component: EditStaff
    },
    {
        path: "/borrow",
        name: "Borrow management",
        component: BorrowManagement
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;