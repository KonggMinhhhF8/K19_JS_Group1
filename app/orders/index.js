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
} from './api.js';

// ================= DOM =================
const amountInput = document.querySelector('#amountInput');

const statusSelect = document.querySelector('#statusSelect');

const customerSelect = document.querySelector('#customerSelect');

const productSelect = document.querySelector('#productSelect');

const createBtn = document.querySelector('.btn-create');

const modal = document.querySelector('#orderModal');

const closeModalBtn = document.querySelector('#closeModalBtn');

const cancelBtn = document.querySelector('#cancelBtn');

const overlay = document.querySelector('.modal-overlay');

const form = document.querySelector('#orderForm');

const modalTitle = document.querySelector('#modalTitle');

const submitBtn = document.querySelector('#submitBtn');

const orderId = document.querySelector('#orderId');

// load lại list sau khi call api create/ edit/ delete..
async function loadOrders() {
    const orders = await getOrders();

    renderOrders(orders);
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
        alert('Không thể tải danh sách đơn hàng');
    }
}
init();

const STATUS_MAP = {
    done: {
        text: 'HOÀN THÀNH',
        className: 'completed',
    },

    pending: {
        text: 'CHỜ XỬ LÝ',
        className: 'pending',
    },

    cancel: {
        text: 'ĐÃ HỦY',
        className: 'cancelled',
    },

    delivering: {
        text: 'ĐANG GIAO',
        className: 'shipping',
    },
};

function renderOrders(orders) {
    const tbody = document.querySelector('#ordersTableBody');

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

            <td>${totalSpending.toLocaleString('vi-VN')}đ</td>

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
        .join('');
    const deleteButtons = document.querySelectorAll('.btn-delete');
}

// Modal

function openCreateModal() {
    form.reset();

    orderId.value = '';

    modalTitle.textContent = 'Thêm đơn hàng';

    submitBtn.textContent = 'Thêm';

    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

createBtn.addEventListener('click', openCreateModal);

closeModalBtn.addEventListener('click', closeModal);

cancelBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);

form.addEventListener('submit', handleSubmit);

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
        .join('')}
    `;
}

function renderProductOptions(products) {
    productSelect.innerHTML = `
    <option value="">-- Chọn sản phẩm --</option>
    ${products
        .map(
            (product) => `
        <option value ="${product.id}">
         ${product.name} - ${product.price.toLocaleString('vi-VN')}đ
        </option>`,
        )
        .join('')}
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
        await createOrder(body);

        closeModal();

        await loadOrders();

        alert('Tạo đơn hàng thành công');
    } catch (error) {
        console.error(error);
        alert('Tạo đơn hàng thất bại');
    }
}
