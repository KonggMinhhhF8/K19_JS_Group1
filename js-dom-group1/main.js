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