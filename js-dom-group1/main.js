import Navigo from "https://esm.sh/navigo@8";
import { renderMainLayout } from "./src/customers/main.js";
import { renderReportLayout } from "./src/reports/main.js";
//
import { renderHomeLayout } from "./src/Home/home.js";
import { renderProductPage } from "./src/products/products.js";
import { renderEditProductPage } from "./src/products/service/edit.js";
//
import { initOrders } from './app/orders/main.js';

//
export const router = new Navigo("/", { hash: true });

// 1. Hàm kiểm tra quyền truy cập
const checkAuth = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    // Nếu không có token, đẩy về trang login
    window.location.href =
      "/data/codeSpace/Code/JavaScript/K19_JS_Group1/app/auth/login.html";
    return false;
  }
  return true;
};

// 2. Cấu hình lại các route với checkAuth
router
  .on("/", () => {
    if (checkAuth()) renderHomeLayout(router);
  })
  .on("/home", () => {
    if (checkAuth()) renderHomeLayout(router);
  })
  .on("/customers", () => {
    if (checkAuth()) renderMainLayout(router);
  })
  .on("/products", () => {
    renderProductPage(router);
  })
  .on("/products/create", () => {
    renderEditProductPage(router);
  })
  .on("/orders", () => {
    document.getElementById("app").innerHTML = OrdersPage();
    initOrders();
  })
  .on("/reports", () => {
    if (checkAuth()) renderReportLayout(router);
  })
  .notFound(() => {
    if (checkAuth()) router.navigate("/");
  })
  .resolve();

console.log("Router đã chạy và đang bảo vệ trang!");
