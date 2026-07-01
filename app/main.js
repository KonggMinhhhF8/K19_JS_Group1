import Navigo from "https://esm.sh/navigo@8";
import { renderMainLayout } from "./customers/main.js";
import { renderHomeLayout } from "./home/main.js";
import { renderReportLayout } from "./reports/main.js";

export const router = new Navigo("/", { hash: true });

router
  .on("/", () => {
    // Luôn đưa về trang chủ (ví dụ: Customer) khi truy cập gốc
    renderMainLayout(router);
  })
  .on("/home", () => {
    // 💡 ĐÃ BỔ SUNG: Xử lý khi gọi router.navigate("/home")
    renderMainLayout(router);
  })
  .on("/customers", () => {
    renderMainLayout(router);
  })
  .on("/reports", () => {
    renderReportLayout(router);
  })
  .notFound(() => {
    // Nếu vào đường dẫn không tồn tại, quay về trang mặc định
    router.navigate("/");
  })
  .resolve();

console.log("Router đã chạy!");
