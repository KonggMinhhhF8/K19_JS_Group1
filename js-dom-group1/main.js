// File: main.js
// import { renderMainLayout } from "./customers/main.js";
import { renderHomeLayout } from "./src/Home/home.js";
import { renderProductsPage } from "./src/products/products.js";
import { renderEditProductPage } from "./src/products/service/edit.js";

const router = new Navigo("/", { hash: true });

// router.on("/customers", () => {
//   renderMainLayout(router);
// });

router.on("/", () => {
  renderHomeLayout(router);
});
router.on("/products",()=>{
  renderProductsPage(router);
})
router.on("/products/create", () => {
  renderEditProductPage(router);
});
router.on("*", () => {
  renderMainLayout(router);
});

router.resolve();

console.log("Router đã chạy!");