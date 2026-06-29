// File: main.js
import { renderMainLayout } from "./customers/main.js";
import { renderHomeLayout } from "./home/main.js";

const router = new Navigo("/", { hash: true });

router.on("/customers", () => {
  renderMainLayout(router);
});

router.on("/", () => {
  renderMainLayout(router);
});

router.on("*", () => {
  renderMainLayout(router);
});

router.resolve();

console.log("Router đã chạy!");
