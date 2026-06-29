import {
  postCustomer,
  getCustomersWithOrders,
  deleteCustomer,
  updateCustomer,
} from "./api.js";
import { renderCustomerTable } from "./main.js";
import { renderForm } from "./form.js";

export const handleAddCustomer = () => {
  const form = document.getElementById("addCustomerForm");
  const divModal = document.getElementById("modal");
  const btnSave = document.getElementById("btnSaveCustomer");

  if (!form) return;

  // Xóa bỏ listener cũ (tránh gắn chồng sự kiện)
  form.removeEventListener("submit", form.submitHandler);

  form.submitHandler = async (e) => {
    e.preventDefault();

    try {
      btnSave.innerText = "Đang xử lý...";
      btnSave.disabled = true;

      const customerData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        rank: document.getElementById("rank").value,
      };

      // --- CHỖ NÀY LÀ QUYẾT ĐỊNH ---
      const editId = form.dataset.editId; // Lấy ID ra kiểm tra

      if (editId) {
        // Đang Sửa: Gọi PUT
        console.log("Đang thực hiện PUT cho ID:", editId);
        await updateCustomer(editId, customerData);
      } else {
        // Đang Thêm: Gọi POST
        console.log("Đang thực hiện POST (Thêm mới)");
        await postCustomer(customerData);
      }

      // Xử lý sau khi thành công
      divModal.classList.remove("flex");
      divModal.classList.add("hidden");
      form.reset();
      delete form.dataset.editId; // Xóa ID sau khi xong

      const updatedCustomers = await getCustomersWithOrders();
      await renderCustomerTable(updatedCustomers);
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      btnSave.innerText = "Lưu";
      btnSave.disabled = false;
    }
  };

  form.addEventListener("submit", form.submitHandler);
};

export const handleDeleteCustomer = async (
  customerId,
  customerName,
  btnElement,
) => {
  const isConfirm = confirm(
    `Bạn có chắc chắn muốn xóa khách hàng: ${customerName}?`,
  );
  if (!isConfirm) return;

  btnElement.innerText = "Đang xóa...";
  btnElement.disabled = true;

  const isSuccess = await deleteCustomer(customerId);

  if (isSuccess) {
    console.log("Xóa thành công, đang tải lại bảng...");
    const updatedData = await getCustomersWithOrders();
    renderCustomerTable(updatedData);
  } else {
    alert("Xóa thất bại! Vui lòng thử lại.");
    btnElement.innerText = "Xóa";
    btnElement.disabled = false;
  }
};

export const handleEditCustomer = async (customerId, customerName) => {
  const form = document.getElementById("addCustomerForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const editId = form.dataset.editId;
    console.log("Đang lưu thay đổi cho khách hàng ID:", editId);
    const customerData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      address: document.getElementById("address").value,
      rank: document.getElementById("rank").value,
    };

    let result = await updateCustomer(editId, customerData);
    if (result) {
      const updatedData = await getCustomersWithOrders();
      renderCustomerTable(updatedData);
      form.reset();
      delete form.dataset.editId;
    }
  });
};
