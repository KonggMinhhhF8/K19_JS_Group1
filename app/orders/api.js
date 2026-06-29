// Chỉ chứa API
// getOrders()
// createOrder()
// updateOrder()
// deleteOrder()
import { get, post, put, del } from '../shared/utils/http.js';

export const getOrders = () => {
    return get('orders');
};
export const getCustomers = () => {
    return get('customers');
};

export const getProducts = () => {
    return get('products');
};

export const createOrder = (data) => {
    return post('orders', data);
};

export const updateOrder = (id, data) => {
    return put(`orders/${id}`, data);
};

export const deleteOrder = (id) => {
    return del(`orders/${id}`);
};


