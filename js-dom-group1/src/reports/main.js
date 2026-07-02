import { getOrders } from "../customers/api.js";
import { renderSidebar } from "../shared/utils/sidebar.js";
import Chart from "https://cdn.jsdelivr.net/npm/chart.js/auto/+esm";
export const renderReportLayout = async (router) => {
  document.body.setAttribute("data-page", "reports");

  document.body.className = "bg-bgLight font-sans text-gray-800";
  // document.body.innerHTML = "";
  const mainContent = document.getElementById("main-content");
  if (!mainContent) {
    console.error("Không tìm thấy phần tử main-content!");
    return;
  }
  mainContent.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "flex min-h-screen container-fluid";

  const sidebarContainer = document.createElement("div");
  sidebarContainer.id = "sidebarContainer";
  wrapper.appendChild(sidebarContainer);

  const main = document.createElement("main");
  main.className = "main-content flex-1 p-8";

  main.innerHTML = `
    <header class="flex justify-between items-center bg-white py-4 px-6 rounded-xl mb-8 shadow-sm">
      <h2 class="text-xl font-bold">Báo cáo kinh doanh</h2>
      <div class="filter-group flex gap-4 items-center">
        <label for="start-date" class="font-medium text-gray-600">Từ:</label>
        <input type="date" id="start-date" value="2026-06-01" class="px-3 py-2 border rounded-lg" />
        
        <label for="end-date" class="font-medium text-gray-600">Đến:</label>
        <input type="date" id="end-date" value="2026-06-30" class="px-3 py-2 border rounded-lg" />
        
        <button type="button" id="btnFilter" class="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition">Lọc</button>
      </div>
    </header>

    <div class="stats-grid grid grid-cols-4 gap-6 mb-8">
      <div class="stat-card bg-white p-6 rounded-xl shadow-sm">
        <h4 class="text-sm text-gray-500 uppercase font-semibold mb-2">Doanh thu</h4>
        <div class="value text-3xl font-bold text-dark my-2" id="stat-revenue">0đ</div>
        <div class="trend up text-green-500 text-sm font-medium"><i class="fas fa-arrow-up"></i> 12% so với tháng trước</div>
      </div>
      <div class="stat-card bg-white p-6 rounded-xl shadow-sm">
        <h4 class="text-sm text-gray-500 uppercase font-semibold mb-2">Đơn hàng</h4>
        <div class="value text-3xl font-bold text-dark my-2" id="stat-orders">0</div>
        <div class="trend up text-green-500 text-sm font-medium"><i class="fas fa-arrow-up"></i> 5%</div>
      </div>
      <div class="stat-card bg-white p-6 rounded-xl shadow-sm">
        <h4 class="text-sm text-gray-500 uppercase font-semibold mb-2">Lợi nhuận</h4>
        <div class="value text-3xl font-bold text-dark my-2" id="stat-profit">0đ</div>
        <div class="trend down text-red-500 text-sm font-medium"><i class="fas fa-arrow-down"></i> 2%</div>
      </div>
      <div class="stat-card bg-white p-6 rounded-xl shadow-sm">
        <h4 class="text-sm text-gray-500 uppercase font-semibold mb-2">Khách mới</h4>
        <div class="value text-3xl font-bold text-dark my-2" id="stat-new-customers">0</div>
        <div class="trend up text-green-500 text-sm font-medium"><i class="fas fa-arrow-up"></i> 18%</div>
      </div>
    </div>

    <div class="charts-container grid grid-cols-3 gap-6 mb-8">
      <div class="chart-box bg-white p-6 rounded-xl shadow-sm col-span-2">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Biểu đồ doanh thu</h3>
        <canvas id="revenueChart"></canvas>
      </div>
      <div class="chart-box bg-white p-6 rounded-xl shadow-sm col-span-1">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">Cơ cấu sản phẩm</h3>
        <canvas id="categoryChart"></canvas>
      </div>
    </div>

    <div class="top-products bg-white p-6 rounded-xl shadow-sm">
      <h3 class="text-lg font-semibold mb-4 text-gray-800">Sản phẩm bán chạy nhất</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b text-gray-500 text-sm">
              <th class="pb-3">Sản phẩm</th>
              <th class="pb-3">Số lượng bán</th>
              <th class="pb-3">Doanh thu</th>
              <th class="pb-3">Tình trạng</th>
            </tr>
          </thead>
          <tbody id="topProductsBody">
            </tbody>
        </table>
      </div>
    </div>
  `;

  wrapper.appendChild(main);
  mainContent.appendChild(wrapper);

  renderSidebar("reports", router);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const loadDashboardData = async () => {
    try {
      const orders = await getOrders();

      const totalRevenue = orders.reduce(
        (sum, order) => sum + order.product.price * order.amount,
        0,
      );
      const totalOrders = orders.length;
      const uniqueCustomers = new Set(orders.map((order) => order.customer.id))
        .size;

      document.getElementById("stat-revenue").innerText =
        formatCurrency(totalRevenue);
      document.getElementById("stat-orders").innerText = totalOrders;
      document.getElementById("stat-profit").innerText = formatCurrency(
        totalRevenue * 0.3,
      );
      document.getElementById("stat-new-customers").innerText = uniqueCustomers;

      const revenueByDate = {};
      orders.forEach((order) => {
        revenueByDate[order.date] =
          (revenueByDate[order.date] || 0) + order.product.price * order.amount;
      });
      const dates = Object.keys(revenueByDate).sort();

      new Chart(document.getElementById("revenueChart").getContext("2d"), {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Doanh thu (VNĐ)",
              data: dates.map((d) => revenueByDate[d]),
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
      });

      const categoryCount = {};
      orders.forEach((order) => {
        const cat = order.product.category.name;
        categoryCount[cat] = (categoryCount[cat] || 0) + order.amount;
      });

      new Chart(document.getElementById("categoryChart").getContext("2d"), {
        type: "doughnut",
        data: {
          labels: Object.keys(categoryCount),
          datasets: [
            {
              data: Object.values(categoryCount),
              backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c"],
            },
          ],
        },
      });

      const productStats = {};
      orders.forEach((order) => {
        const pid = order.product.id;
        if (!productStats[pid])
          productStats[pid] = {
            name: order.product.name,
            quantity: 0,
            revenue: 0,
            remaining: order.product.remaining,
          };
        productStats[pid].quantity += order.amount;
        productStats[pid].revenue += order.product.price * order.amount;
      });

      const sortedProducts = Object.values(productStats).sort(
        (a, b) => b.revenue - a.revenue,
      );
      const tbody = document.getElementById("topProductsBody");
      tbody.innerHTML = sortedProducts
        .slice(0, 5)
        .map(
          (prod) => `
        <tr class="border-b">
          <td class="py-3">${prod.name}</td>
          <td class="py-3">${prod.quantity}</td>
          <td class="py-3">${formatCurrency(prod.revenue)}</td>
          <td class="py-3 font-semibold ${prod.remaining > 5 ? "text-green-500" : "text-red-500"}">
            ${prod.remaining > 5 ? "Còn hàng" : "Sắp hết"}
          </td>
        </tr>
      `,
        )
        .join("");
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
    }
  };

  // Kích hoạt load dữ liệu
  loadDashboardData();

  // 6. Gắn sự kiện cho nút Lọc (nếu cần filter theo ngày sau này)
  document.getElementById("btnFilter").addEventListener("click", () => {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    console.log(`Lọc dữ liệu từ ${startDate} đến ${endDate}`);
    // Tại đây bạn gọi lại API truyền theo param ngày tháng và vẽ lại giao diện
  });
};
