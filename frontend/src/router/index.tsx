import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import MenuManagement from '../pages/system/MenuManagement';
import Login from '../pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'system/menu',
        element: <MenuManagement />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router; 