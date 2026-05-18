import axiosInstance from "./axios";

// Auth
export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data);

export const loginUser = (data) =>
  axiosInstance.post("/auth/login", data);

export const getMe = () =>
  axiosInstance.get("/auth/me");

// Categories
export const getCategories = () =>
  axiosInstance.get("/categories");

export const createGlobalCategory = (data) =>
  axiosInstance.post("/categories/global", data);

export const createPersonalCategory = (data) =>
  axiosInstance.post("/categories/personal", data);

// Expenses
export const getMyExpenses = () =>
  axiosInstance.get("/expenses/my");

export const createExpense = (data) =>
  axiosInstance.post("/expenses", data);

export const deleteExpense = (id) =>
  axiosInstance.delete(`/expenses/${id}`);

// Budgets
export const getMyBudgets = () =>
  axiosInstance.get("/budgets");

export const createBudget = (data) =>
  axiosInstance.post("/budgets", data);

export const updateBudget = (id, data) =>
  axiosInstance.patch(`/budgets/${id}`, data);

// Reports
export const getMyReports = () =>
  axiosInstance.get("/reports/summary");

// Admin
export const getAllUsers = () =>
  axiosInstance.get("/admin/users");

export const getAllExpenses = () =>
  axiosInstance.get("/admin/expenses");

export const getAllReports = () =>
  axiosInstance.get("/admin/reports");

export const deleteUser = (id) =>
  axiosInstance.delete(`/admin/users/${id}`);

export const createGlobalCategoryAdmin = (data) =>
  axiosInstance.post("/categories/global", data);
