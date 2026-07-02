import "./style.css";
import { renderSidebar } from "../shared/utils/sidebar.js";
export function OrdersPage() {
  return `
    <div class="container">
            <main class="main-content">
                <header>
                    <div class="search-bar">
                        <input
                            id="searchInput"
                            type="text"
                            placeholder="Tìm mã đơn, tên khách hàng..."
                        />
                    </div>
                    <button class="btn-create">
                        <i class="fas fa-plus"></i>
                        Tạo đơn hàng
                    </button>
                </header>

                <section class="stats">
                    <div class="card blue">
                        <h3>Tổng đơn hàng</h3>
                        <p id="totalOrders">0</p>

                    </div>
                    <div class="card orange">
                        <h3>Đang xử lý</h3>
                        <p id="pendingOrders">0</p>

                    </div>
                    <div class="card green">
                        <h3>Thành công</h3>
                        <p id="doneOrders">0</p>

                    </div>
                    <div class="card cyan">
                        <h3>Đang giao</h3>
                        <p id="deliveringOrders">0</p>
                    </div>
                    <div class="card red">
                        <h3>Đã hủy</h3>
                        <p id="cancelOrders">0</p>
                    </div>
                </section>

                <section class="table-container">
                    <div class="order-controls">
                        <div class="tabs">
                            <button id="filterAll" class="tab active">
                                Tất cả
                            </button>
                            <button id="filterPending" class="tab">
                                Chờ xử lý
                            </button>
                            <button id="filterDelivering" class="tab">
                                Đang giao
                            </button>
                            <button id="filterDone" class="tab">Đã xong</button>
                            <button id="filterCancel" class="tab">Đã hủy</button>
                        </div>
                        <div class="date-filter">
                            <input
                                type="date"
                                style="
                                    padding: 5px;
                                    border: 1px solid #ddd;
                                    border-radius: 5px;
                                "
                            />
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th>Sản phẩm</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="ordersTableBody">
                            
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
        <!-- ================= ORDER MODAL ================= -->

        <div id="orderModal" class="modal hidden">
            <div class="modal-overlay"></div>

            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle">Thêm Order</h2>

                    <button
                        type="button"
                        id="closeModalBtn"
                        class="modal-close"
                    >
                        ×
                    </button>
                </div>

                <form id="orderForm">
                    <input type="hidden" id="orderId" />
                    <div class="form-group">
                        <label for="customerSelect"> Khách hàng </label>

                        <select id="customerSelect" required>
                            <option value="">-- Chọn khách hàng --</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="productSelect"> Sản phẩm </label>

                        <select id="productSelect" required>
                            <option value="">-- Chọn sản phẩm --</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="amountInput"> Số lượng </label>

                        <input
                            id="amountInput"
                            type="number"
                            min="1"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="statusSelect"> Trạng thái </label>

                        <select id="statusSelect" required>
                            <option value="pending">Chờ xử lý</option>

                            <option value="delivering">Đang giao</option>

                            <option value="done">Hoàn thành</option>

                            <option value="cancel">Đã hủy</option>
                        </select>
                    </div>

                    <div class="modal-footer">
                        <button
                            type="button"
                            id="cancelBtn"
                            class="btn btn-secondary"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            id="submitBtn"
                            class="btn btn-primary"
                        >
                            Thêm
                        </button>
                    </div>
                </form>
            </div>
        </div>
`;
}
