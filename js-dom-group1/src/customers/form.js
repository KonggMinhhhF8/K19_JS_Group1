import { postCustomer, getCustomersWithOrders } from "./api.js";
import { renderCustomerTable } from "./main.js";

const formData = [
  { key: "name", value: "Tên khách hàng" },
  { key: "email", value: "Email" },
  { key: "phone", value: "Số điện thoại" },
  { key: "address", value: "Địa chỉ" },
];

export const renderForm = () => {
  const divModal = document.createElement("div");
  divModal.id = "modal";
  divModal.className =
    "hidden fixed inset-0 bg-black/50 justify-center items-center z-50";

  const formModalContainer = document.createElement("form");
  formModalContainer.id = "addCustomerForm";
  formModalContainer.className = "bg-white p-6 rounded-xl w-[320px] shadow-lg";
  divModal.appendChild(formModalContainer);

  const h3 = document.createElement("h3");
  h3.id = "modalTitle";
  h3.className = "text-lg font-bold text-dark mb-4";
  h3.innerText = "Thêm khách hàng";
  formModalContainer.appendChild(h3);

  formData.forEach((item) => {
    const inputEl = document.createElement("input");
    inputEl.className =
      "w-full my-2 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    inputEl.id = item.key;
    inputEl.name = item.key;
    inputEl.placeholder = item.value;
    inputEl.required = true;
    formModalContainer.appendChild(inputEl);
  });

  const selectRank = document.createElement("select");
  selectRank.id = "rank";
  selectRank.name = "rank";
  selectRank.title = "Hạng";
  selectRank.className =
    "w-full my-2 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer";

  const optionGold = document.createElement("option");
  optionGold.value = "GOLD";
  optionGold.innerText = "Vàng";
  selectRank.appendChild(optionGold);

  const optionSilver = document.createElement("option");
  optionSilver.value = "SILVER";
  optionSilver.innerText = "Bạc";
  selectRank.appendChild(optionSilver);

  const optionBronze = document.createElement("option");
  optionBronze.value = "BRONZE";
  optionBronze.innerText = "Đồng";
  selectRank.appendChild(optionBronze);

  formModalContainer.appendChild(selectRank);

  const btnGroup = document.createElement("div");
  btnGroup.className = "flex gap-2 mt-4";

  const btnSaveCustomer = document.createElement("button");

  btnSaveCustomer.type = "submit";
  btnSaveCustomer.id = "btnSaveCustomer";
  btnSaveCustomer.className =
    "flex-1 px-4 py-2 bg-primary hover:bg-blue-600 text-white font-medium rounded-lg transition";
  btnSaveCustomer.innerText = "Lưu";

  const btnCloseModal = document.createElement("button");
  btnCloseModal.type = "button";
  btnCloseModal.className =
    "flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition";
  btnCloseModal.innerText = "Hủy";

  btnCloseModal.addEventListener("click", () => {
    divModal.classList.add("hidden");
    divModal.classList.remove("flex");
    formModalContainer.reset();
  });

  btnGroup.appendChild(btnSaveCustomer);
  btnGroup.appendChild(btnCloseModal);
  formModalContainer.appendChild(btnGroup);

  document.body.appendChild(divModal);
};
