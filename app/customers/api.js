const API_URL = "https://wo365ovs53.execute-api.ap-southeast-1.amazonaws.com";

export const getCustomers = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(API_URL + "/customers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }
    const data = await response.json();
    console.log("Data: ", data);
    return data;
  } catch (e) {
    console.log(e);
  }
};
export const getOrders = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(API_URL + "/orders", {
      // Thay đổi endpoint cho đúng với API của bạn
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.log("Lỗi fetch orders:", e);
    return [];
  }
};

export const getCustomersWithOrders = async () => {
  try {
    const customers = await getCustomers();
    const orders = await getOrders();
    if (!customers || !Array.isArray(customers)) return [];
    const validOrders = Array.isArray(orders) ? orders : [];

    const oderStats = {};

    validOrders.forEach((order) => {
      if (!order.customer?.id || !order.product) return;

      const cusId = String(order.customer.id);
      const price = parseFloat(order.product.price) || 0;
      const amount = parseInt(order.amount) || 0;
      const spending = amount * price;

      if (!oderStats[cusId]) {
        oderStats[cusId] = { totalSales: 0, totalSpending: 0 };
      }
      oderStats[cusId].totalSales += 1;
      oderStats[cusId].totalSpending += spending;
    });

    return customers.map((customer) => {
      const stats = oderStats[String(customer.id)] || {
        totalSales: 0,
        totalSpending: 0,
      };
      return {
        ...customer,
        totalSales: stats.totalSales,
        totalSpending: stats.totalSpending,
      };
    });
  } catch (e) {
    console.error("Lỗi chi tiết trong getCustomersWithOrders:", e);
    return [];
  }
};

export const postCustomer = async (customer) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(API_URL + "/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customer),
    });
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

export const deleteCustomer = async (id) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(API_URL + "/customers/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }
    return await response.json();
  } catch (e) {
    console.log(e);
  }
};

export const updateCustomer = async (id, customerData) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await fetch(`${API_URL}/customers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error(`Lỗi cập nhật: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi API PUT:", error);
    return null;
  }
};
