import { getCustomers, getOrders, getCustomersWithOrders } from "./api.js";
import { renderSidebar } from "../shared/utils/sidebar.js";
import { renderForm } from "./form.js";
import {
  handleAddCustomer,
  handleDeleteCustomer,
  handleEditCustomer,
  handleSearchCustomers,
  handleGetTotalCustomers,
} from "./handlers.js";

export const renderMainLayout = async (router) => {
  document.body.setAttribute("data-page", "customers");
  document.body.className = "bg-bgLight font-sans text-gray-800";
  document.body.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "flex min-h-screen";

  const sidebarContainer = document.createElement("div");
  sidebarContainer.id = "sidebarContainer";
  wrapper.appendChild(sidebarContainer);

  const main = document.createElement("main");
  main.className = "flex-1 p-8";

  const header = document.createElement("header");
  header.className =
    "flex justify-between items-center bg-white py-4 px-6 rounded-xl mb-8 shadow-sm";

  const searchDiv = document.createElement("div");
  searchDiv.className = "relative";
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "searchInput";
  searchInput.placeholder = "Tìm kiếm theo tên, email, SĐT...";
  searchInput.className =
    "px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary w-64 mb-4";
  searchDiv.appendChild(searchInput);
  header.appendChild(searchDiv);

  const btnAdd = document.createElement("button");
  btnAdd.id = "btnOpenAddModal";
  btnAdd.className =
    "bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-sm";

  const iconAdd = document.createElement("i");
  iconAdd.className = "fas fa-user-plus mr-1";
  btnAdd.appendChild(iconAdd);
  btnAdd.appendChild(document.createTextNode(" Thêm khách hàng"));

  header.appendChild(btnAdd);
  main.appendChild(header);

  main.appendChild(document.createTextNode("Đơn hàng"));

  const sectionStats = document.createElement("section");
  sectionStats.className = "grid grid-cols-3 gap-6 mb-8";

  const createStatCard = (titleText, valueText, valueId = null) => {
    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-xl shadow-sm";

    const h3 = document.createElement("h3");
    h3.className = "text-sm text-gray-500 uppercase font-semibold mb-2";
    h3.innerText = titleText;

    const p = document.createElement("p");
    p.className = "text-3xl font-bold text-dark";
    if (valueId) p.id = valueId;
    p.innerText = valueText;

    card.appendChild(h3);
    card.appendChild(p);
    return card;
  };

  sectionStats.appendChild(
    createStatCard("Tổng khách hàng", "", "totalCustomers"),
  );
  sectionStats.appendChild(createStatCard("Khách hàng mới (Tháng)", "42"));
  sectionStats.appendChild(createStatCard("Tỉ lệ quay lại", "65%"));

  main.appendChild(sectionStats);

  const sectionTable = document.createElement("section");
  sectionTable.className = "bg-white p-6 rounded-xl shadow-sm";

  const tableContainer = document.createElement("div");
  tableContainer.id = "tableContainer";

  sectionTable.appendChild(tableContainer);
  main.appendChild(sectionTable);

  wrapper.appendChild(main);
  document.body.appendChild(wrapper);
  renderSidebar("customers", router);
  await renderCustomerTable();
  await initPage();
  renderForm();
  setupModalEvents();
  handleAddCustomer();
  searchInput.addEventListener("input", (e) => {
    handleSearchCustomers(e.target);
  });
  handleGetTotalCustomers();
};
const setupModalEvents = () => {
  const btnOpen = document.getElementById("btnOpenAddModal");
  const modal = document.getElementById("modal");
  if (btnOpen && modal) {
    btnOpen.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });
  } else {
    console.error("Không tìm thấy nút hoặc modal!");
  }
};

const tableData = [
  { key: "id", value: "ID" },
  { key: "name", value: "Tên khách hàng" },
  { key: "email", value: "Email" },
  { key: "rank", value: "Hạng" },
  { key: "totalSales", value: "Đơn hàng" },
  { key: "totalSpending", value: "Tổng chi tiêu" },
  { key: "action", value: "Thao tác" },
];
export const renderCustomerTable = async (data) => {
  const tableContainer = document.getElementById("tableContainer");
  if (!tableContainer) return;
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.className = "w-full text-left border-collapse";

  // --- THEAD ---
  const tHead = document.createElement("thead");
  const trHead = document.createElement("tr");
  trHead.className = "bg-gray-50 border-b border-gray-100";
  tableData.forEach((item) => {
    const th = document.createElement("th");
    th.className = "p-4 text-gray-600 font-medium text-sm";
    th.innerText = item.value;
    trHead.appendChild(th);
  });
  tHead.appendChild(trHead);
  table.appendChild(tHead);
  tableContainer.appendChild(table);
  // --- TBODY ---
  const safeData = Array.isArray(data) ? data : [];
  const tBody = document.createElement("tbody");
  safeData.forEach((customer) => {
    const trBody = document.createElement("tr");
    trBody.className =
      "border-b border-gray-100 hover:bg-gray-50 transition duration-150";
    tableData.forEach((col) => {
      const td = document.createElement("td");
      td.className = "p-4 text-gray-800 text-sm";
      td.innerText = customer[col.key] || "";
      trBody.appendChild(td);
      if (col.key === "action") {
        const btnEdit = document.createElement("button");
        btnEdit.className =
          "text-blue-500 hover:text-blue-700 mr-4 font-medium";
        btnEdit.innerText = "Sửa";
        const btnDelete = document.createElement("button");
        btnDelete.className = "text-red-500 hover:text-red-700 font-medium";
        btnDelete.innerText = "Xóa";
        td.appendChild(btnEdit);
        td.appendChild(btnDelete);

        btnDelete.addEventListener("click", () => {
          handleDeleteCustomer(customer.id, customer.name, btnDelete);
        });

        btnEdit.addEventListener("click", () => {
          const divModal = document.getElementById("modal");

          const form = document.getElementById("addCustomerForm");
          divModal.classList.remove("hidden");
          divModal.classList.add("flex");

          document.getElementById("modalTitle").innerText = "Sửa khách hàng";
          form.dataset.editId = customer.id;
          document.getElementById("name").value = customer.name;
          document.getElementById("email").value = customer.email;
          document.getElementById("phone").value = customer.phone;
          document.getElementById("address").value = customer.address;
          document.getElementById("rank").value = customer.rank;

          handleEditCustomer(customer.id, customer.name);
        });
      }
    });
    tBody.appendChild(trBody);
    table.appendChild(tBody);
    tableContainer.appendChild(table);
  });
};

export const initPage = async () => {
  try {
    const data = await getCustomersWithOrders();
    console.log("Đang vẽ bảng với:", data);
    renderCustomerTable(data);
  } catch (error) {
    console.error("Lỗi khởi tạo trang:", error);
  }
};

initPage();
