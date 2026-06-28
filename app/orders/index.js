// Chỉ xử lý danh sách

// loadOrders()
// renderTable()
// handleDelete()

import { getOrders } from './service.js';

// ================= DOM =================

const createBtn = document.querySelector('.btn-create');

const modal = document.querySelector('#orderModal');

const closeModalBtn = document.querySelector('#closeModalBtn');

const cancelBtn = document.querySelector('#cancelBtn');

const overlay = document.querySelector('.modal-overlay');

const form = document.querySelector('#orderForm');

const modalTitle = document.querySelector('#modalTitle');

const submitBtn = document.querySelector('#submitBtn');

async function init() {
    try {
        const orders = await getOrders();

        renderOrders(orders);
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
}

// Modal

function openModal() {
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

createBtn.addEventListener('click', openModal);

closeModalBtn.addEventListener('click', closeModal);

cancelBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', closeModal);
