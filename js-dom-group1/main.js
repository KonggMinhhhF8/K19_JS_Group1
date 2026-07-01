<<<<<<< HEAD:app/main.js
import Navigo from "https://esm.sh/navigo@8";
import { renderMainLayout } from "./customers/main.js";
import { renderHomeLayout } from "./home/main.js";
import { renderReportLayout } from "./reports/main.js";

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
    if (checkAuth()) renderMainLayout(router);
  })
  .on("/home", () => {
    if (checkAuth()) renderHomeLayout(router);
  })
  .on("/customers", () => {
    if (checkAuth()) renderMainLayout(router);
  })
  router.on("/products/create", () => {
  renderEditProductPage(router);
});
  .on("/reports", () => {
    if (checkAuth()) renderReportLayout(router);
  })
  .notFound(() => {
    if (checkAuth()) router.navigate("/");
  })
  .resolve();

console.log("Router đã chạy và đang bảo vệ trang!");
=======
import { renderHomeLayout } from "./src/Home/home.js";
import { renderProductPage } from "./src/products/products.js";
import { renderEditProductPage } from "./src/products/service/edit.js";

const router = new Navigo("/", { hash: true });

router.on("/", () => {
  renderHomeLayout(router);
});
router.on("/products", () => {
  renderProductPage(router);
});
router.on("/products/create", () => {
  renderEditProductPage(router);
});

// SỬA Ở ĐÂY: Dùng notFound thay vì "*"
router.notFound(() => {
  renderHomeLayout(router);
});

router.resolve();
>>>>>>> 07e6fcb76a6e193d9b343b38d2b307fe29220f10:js-dom-group1/main.js
