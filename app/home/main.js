import { router } from "../main.js";
import { renderSidebar } from "../utils/sidebar.js";

export const renderHomeLayout = () => {
  document.body.innerHTML = "";
  const h2 = document.createElement("h2");
  h2.className = "text-2xl font-bold p-8";
  h2.innerText = "Trang chủ Home";

  document.body.appendChild(h2);
  console.log("Đang vào trang chủ Home");

  const wrapper = document.createElement("div");
  wrapper.className = "flex min-h-screen";

  const sidebarContainer = document.createElement("div");
  sidebarContainer.id = "sidebarContainer";
  wrapper.appendChild(sidebarContainer);

  document.body.appendChild(wrapper);
  renderSidebar("home", router);
};
