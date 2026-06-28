// Chỉ chứa API
// getOrders()
// createOrder()
// updateOrder()
// deleteOrder()
import { get, post, put, del } from "../shared/utils/http.js"
export const getOrders = () => {
    return get('orders');
};

// export const createOrder = (data) => post('orders, data');

// export const updateOrder = (id, data) => put(`orders/${id}`, data);
// export const deleteOrder = (id) => del(`orders/${id}`);
