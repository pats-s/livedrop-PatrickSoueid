/**
 * React Router configuration (Updated with Orders page)
 * Location: /apps/storefront/src/lib/router.tsx
 */

import { createBrowserRouter } from 'react-router-dom';

// Direct imports - no lazy loading
import App from '../App';
import CatalogPage from '../pages/catalog';
import ProductPage from '../pages/product';
import CartPage from '../pages/cart';
import CheckoutPage from '../pages/checkout';
import OrderStatusPage from '../pages/order-status';
import OrdersPage from '../pages/orders';
import LoginPage from '../pages/login';
import MyOrdersPage from '../pages/my-orders';
import AdminPage from '../pages/admin';



export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <CatalogPage />,
      },
      {
        path: 'p/:id',
        element: <ProductPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'order/:id',
        element: <OrderStatusPage />,
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/orders/:orderId',
        element: <OrderStatusPage />
      },
      {
        path: '/my-orders',
        element: <MyOrdersPage />
      },
      {
        path: '/admin',
        element: <AdminPage />
      }
    ],
  },
]);