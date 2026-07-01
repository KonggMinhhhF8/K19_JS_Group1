const sidebars = [
  { key: "home", value: "Tổng quan", icon: "fas fa-home", path: "/" },
  { key: "products", value: "Sản phẩm", icon: "fas fa-box", path: "/products" },
  {
    key: "orders",
    value: "Đơn hàng",
    icon: "fas fa-shopping-cart",
    path: "/orders",
  },
  {
    key: "customers",
    value: "Khách hàng",
    icon: "fas fa-users",
    path: "/customers",
  },
  {
    key: "reports",
    value: "Báo cáo",
    icon: "fas fa-chart-line",
    path: "/reports",
  },
];

export const renderSidebar = (activeKey, router) => {
  const sidebarContainer = document.getElementById("sidebarContainer");
  if (!sidebarContainer) return;

  sidebarContainer.innerHTML = "";

  const sidebar = document.createElement("aside");
  sidebar.className =
    "w-[260px] bg-[#2c3e50] text-white p-6 sticky top-0 h-screen";

  const h2 = document.createElement("h2");
  h2.className = "text-[#3498db] text-2xl font-bold text-center mb-10";
  h2.innerText = "ShopAdmin";
  sidebar.appendChild(h2);

  const ul = document.createElement("ul");
  ul.className = "space-y-1";
  sidebar.appendChild(ul);

  sidebars.forEach((item) => {
    const li = document.createElement("li");
    const isActive = item.key === activeKey;

    const baseClasses =
      "p-4 cursor-pointer rounded-lg transition duration-300 ";
    const stateClasses = isActive
      ? "bg-slate-700 text-[#3498db]"
      : "text-gray-300 hover:bg-slate-700 hover:text-[#3498db]";

    li.className = baseClasses + stateClasses;
    li.innerHTML = `<i class="${item.icon} w-5 mr-3"></i> ${item.value}`;

    li.addEventListener("click", () => {
      router.navigate(item.path);
    });

    ul.appendChild(li);
  });

  sidebarContainer.appendChild(sidebar);
};