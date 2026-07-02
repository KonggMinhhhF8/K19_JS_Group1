import Navigo from "https://esm.sh/navigo@8";

export const router = new Navigo("/", { hash: true });

// 1. Hàm kiểm tra quyền truy cập
const checkAuth = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    // Nếu không có token, đẩy về trang login
    window.location.href = "./src/login/index.html";
    return false;
  }
  return true;
};

// Chưa đăng nhập -> chặn ngay, không load bất kỳ trang nào khác
if (checkAuth()) {
  // 2. Cấu hình lại các route với checkAuth (lazy-load từng trang khi được truy cập)
  router
    .on("/", async () => {
      const { renderHomeLayout } = await import("./src/Home/home.js");
      renderHomeLayout(router);
    })
    .on("/home", async () => {
      const { renderHomeLayout } = await import("./src/Home/home.js");
      renderHomeLayout(router);
    })
    .on("/customers", async () => {
      const { renderMainLayout } = await import("./src/customers/main.js");
      renderMainLayout(router);
    })
    .on("/products", async () => {
      const { renderProductPage } = await import("./src/products/products.js");
      renderProductPage(router);
    })
    .on("/products/create", async () => {
      const { renderEditProductPage } = await import(
        "./src/products/service/edit.js"
      );
      renderEditProductPage(router);
    })
    .on("/orders", async () => {
      const { OrdersPage } = await import("./src/orders/index.js");
      const { initOrders } = await import("./src/orders/main.js");
      document.getElementById("main-content").innerHTML = OrdersPage();
      initOrders(router);
    })
    .on("/reports", async () => {
      const { renderReportLayout } = await import("./src/reports/main.js");
      renderReportLayout(router);
    })
    .notFound(() => {
      router.navigate("/");
    })
    .resolve();

  console.log("Router đã chạy và đang bảo vệ trang!");
}
