// Chỉ xử lý danh sách

// loadOrders()
// renderTable()
// handleDelete()

import {
  getOrders,
  getCustomers,
  getProducts,
  createOrder,
  deleteOrder,
  updateOrder,
} from "./api.js";
import {renderSidebar} from  "../shared/utils/sidebar.js";
import { getNewAccessToken } from "../shared/utils/getNewAccessToken.js";

// ================= DOM =================
let amountInput;
let statusSelect;
let customerSelect;
let productSelect;

let createBtn;
let modal;
let closeModalBtn;
let cancelBtn;
let overlay;

let form;
let modalTitle;
let submitBtn;
let orderId;

let searchInput;

let filterAll;
let filterPending;
let filterDelivering;
let filterDone;
let filterCancel;

let totalOrders;
let pendingOrders;
let deliveringOrders;
let doneOrders;
let cancelOrders;

let tbody;

function initDOM() {
  amountInput = document.querySelector("#amountInput");
  statusSelect = document.querySelector("#statusSelect");

  customerSelect = document.querySelector("#customerSelect");
  productSelect = document.querySelector("#productSelect");

  createBtn = document.querySelector(".btn-create");

  modal = document.querySelector("#orderModal");

  closeModalBtn = document.querySelector("#closeModalBtn");

  cancelBtn = document.querySelector("#cancelBtn");

  overlay = document.querySelector(".modal-overlay");

  form = document.querySelector("#orderForm");

  modalTitle = document.querySelector("#modalTitle");

  submitBtn = document.querySelector("#submitBtn");

  orderId = document.querySelector("#orderId");

  searchInput = document.querySelector("#searchInput");

  filterAll = document.querySelector("#filterAll");

  filterPending = document.querySelector("#filterPending");

  filterDelivering = document.querySelector("#filterDelivering");

  filterDone = document.querySelector("#filterDone");

  filterCancel = document.querySelector("#filterCancel");

  totalOrders = document.querySelector("#totalOrders");

  pendingOrders = document.querySelector("#pendingOrders");

  deliveringOrders = document.querySelector("#deliveringOrders");

  doneOrders = document.querySelector("#doneOrders");

  cancelOrders = document.querySelector("#cancelOrders");

  tbody = document.querySelector("#ordersTableBody");
}

// Biến lưu danh sách orders

let orders = [];
let currentFilter = "all";

// load lại list sau khi call api create/ edit/ delete..
async function loadOrders() {
  orders = await getOrders();

  filteredOrders(currentFilter);
  renderStats(orders);
}

async function init() {
  try {
    await loadOrders();

    const customers = await getCustomers();

    const products = await getProducts();

    renderCustomerOptions(customers);
    renderProductOptions(products);
  } catch (error) {
    console.error(error);
    alert("Không thể tải danh sách đơn hàng");

    getNewAccessToken();
  }
}

const STATUS_MAP = {
  done: {
    text: "HOÀN THÀNH",
    className: "completed",
  },

  pending: {
    text: "CHỜ XỬ LÝ",
    className: "pending",
  },

  cancel: {
    text: "ĐÃ HỦY",
    className: "cancelled",
  },

  delivering: {
    text: "ĐANG GIAO",
    className: "shipping",
  },
};

function renderOrders(orders) {
  tbody = document.querySelector("#ordersTableBody");

  tbody.innerHTML = orders
    .map((order) => {
      const totalSpending = order.product.price * order.amount;
      const status = STATUS_MAP[order.status];
      return `
        <tr>
            <td>#ORD-${order.id}</td>

            <td>
                 <strong>${order.customer.name}</strong>
                <br>
                <small>${order.customer.phone}</small>
            </td>

            <td>
            ${order.product.name}
            (x${order.amount})
            </td>

            <td>${totalSpending.toLocaleString("vi-VN")}đ</td>

            <td>
                <span class="badge ${status.className}">${status.text}</span>
            </td>

            <td>
              <button
        class="btn-action btn-edit"
        data-id="${order.id}"
        title="Chỉnh sửa"
    >
        <i class="fas fa-edit"></i>
    </button>

    <button
        class="btn-action btn-delete"
        data-id="${order.id}"
        title="Xóa"
    >
        <i class="fas fa-trash"></i>
    </button>
            </td>
        </tr>`;
    })
    .join("");
  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleDelete(Number(button.dataset.id));
    });
  });

  const editButtons = document.querySelectorAll(".btn-edit");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleEdit(Number(button.dataset.id));
    });
  });
}

// Hàm render các stats ở 4 cards phía trên cùng

function renderStats(orders) {
  totalOrders.textContent = orders.length;

  const stats = {
    pending: 0,
    delivering: 0,
    done: 0,
    cancel: 0,
  };

  orders.forEach((order) => {
    if (stats[order.status] !== undefined) {
      stats[order.status]++;
    }
  });

  pendingOrders.textContent = stats.pending;
  deliveringOrders.textContent = stats.delivering;
  doneOrders.textContent = stats.done;
  cancelOrders.textContent = stats.cancel;
}
// Modal

function openCreateModal() {
  form.reset();

  orderId.value = "";

  modalTitle.textContent = "Thêm đơn hàng";

  submitBtn.textContent = "Thêm";

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

// Thêm event

function addEvents() {
  createBtn.addEventListener("click", openCreateModal);

  closeModalBtn.addEventListener("click", closeModal);

  cancelBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", closeModal);

  form.addEventListener("submit", handleSubmit);

  searchInput.addEventListener("input", handleSearch);

  filterPending.addEventListener("click", () => {
    currentFilter = "pending";
    activeTab(filterPending);
    filteredOrders(currentFilter);
  });

  filterDelivering.addEventListener("click", () => {
    currentFilter = "delivering";
    activeTab(filterDelivering);
    filteredOrders(currentFilter);
  });

  filterDone.addEventListener("click", () => {
    currentFilter = "done";
    activeTab(filterDone);
    filteredOrders(currentFilter);
  });

  filterAll.addEventListener("click", () => {
    currentFilter = "all";
    activeTab(filterAll);
    filteredOrders(currentFilter);
  });

  filterCancel.addEventListener("click", () => {
    currentFilter = "cancel";
    activeTab(filterCancel);
    filteredOrders(currentFilter);
  });
}

function renderCustomerOptions(customers) {
  customerSelect.innerHTML = `
    <option value="">-- Chọn khách hàng --</option>
    ${customers
      .map(
        (customer) => `
        <option value="${customer.id}">
        ${customer.name}
        </option>`,
      )
      .join("")}
    `;
}

function renderProductOptions(products) {
  productSelect.innerHTML = `
    <option value="">-- Chọn sản phẩm --</option>
    ${products
      .map(
        (product) => `
        <option value ="${product.id}">
         ${product.name} - ${product.price.toLocaleString("vi-VN")}đ
        </option>`,
      )
      .join("")}
    `;
}

async function handleSubmit(event) {
  event.preventDefault();

  const customerId = Number(customerSelect.value);

  const productId = Number(productSelect.value);

  const amount = Number(amountInput.value);

  const status = statusSelect.value;

  const body = {
    productId,
    customerId,
    amount,
    status,
  };

  try {
    // EDIT
    if (orderId.value) {
      await updateOrder(Number(orderId.value), body);
      alert("Cập nhật đơn hàng thành công");
    }

    // CREATE
    else {
      await createOrder(body);

      alert("Tạo đơn hàng thành công");
    }

    closeModal();

    await loadOrders();
  } catch (error) {
    console.error(error);

    alert("Có lỗi xảy ra");
  }
}

async function handleDelete(id) {
  const confirmed = confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?");

  if (!confirmed) {
    return;
  }

  try {
    await deleteOrder(id);
    await loadOrders();

    alert("Xóa thành công");
  } catch (error) {
    console.error(error);
    alert("Xóa đơn hàng thất bại");
  }
}

function handleEdit(id) {
  const order = orders.find((order) => order.id === id);
  if (!order) {
    alert("Không tìm thấy đơn hàng");
    return;
  }

  // Gán các giá trị để click vào tự fill trong form edit
  customerSelect.value = order.customer.id;
  productSelect.value = order.product.id;
  amountInput.value = order.amount;
  statusSelect.value = order.status;
  orderId.value = order.id;

  // Tận dụng form create > đổi text
  modalTitle.textContent = "Chỉnh sửa đơn hàng";
  submitBtn.textContent = "Cập nhật";

  // Mở form
  modal.classList.remove("hidden");
}

// Hàm search theo tên khách hàng, mã đơn hàng, tên sản phẩm...

function handleSearch() {
  const keyword = searchInput.value.trim().toLowerCase();
  // Điều kiện search

  const filteredOrders = orders.filter((order) => {
    const orderCode = `#ord-${order.id}`;
    const customerName = order.customer.name.toLowerCase();
    const productName = order.product.name.toLowerCase();

    return (
      orderCode.includes(keyword) ||
      customerName.includes(keyword) ||
      productName.includes(keyword)
    );
  });

  renderOrders(filteredOrders);
}

// Hàm filter theo các tabs phía trên

function filteredOrders(status) {
  if (status === "all") {
    renderOrders(orders);
    return;
  }

  const filteredOrders = orders.filter((order) => {
    return order.status === status;
  });

  renderOrders(filteredOrders);
}

// Highlight tab đang chọn

function activeTab(button) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  button.classList.add("active");
}

export async function initOrders() {
  initDOM();

  addEvents();

  await init();
}
