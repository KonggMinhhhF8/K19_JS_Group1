import Navigo from 'navigo';
import OrdersPage from './app/orders/index.js';
import { initOrders } from './app/orders/main.js';

const router = new Navigo('/');

router.on('/orders', () => {
    document.getElementById('app').innerHTML = OrdersPage();
    initOrders();
});

router.on('/', () => {
    router.navigate('/orders');
});

router.resolve();
