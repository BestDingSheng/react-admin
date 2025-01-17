import { Navigate, RouteObject } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/dashboard';
import Login from '../pages/login';
import Register from '../pages/register';
import MenuManagement from '../pages/system/MenuManagement';
import RoleManagement from '../pages/system/RoleManagement';
import NotFound from '../pages/NotFound';
import Forbidden from '../pages/403';
import UserManagement from '../pages/system/UserManagement';
import useAuthStore from '../stores/useAuthStore';
import AuthRoute from './AuthRoute';

// 路由守卫组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (token) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

// 系统路由
const systemRoutes: RouteObject[] = [
  {
    path: 'menu',
    element: <AuthRoute><MenuManagement /></AuthRoute>,
  },
  {
    path: 'role',
    element: <AuthRoute><RoleManagement /></AuthRoute>,
  },
  {
    path: 'user',
    element: <AuthRoute><UserManagement /></AuthRoute>,
  },
];

// 主路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PrivateRoute><MainLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'system',
        children: systemRoutes,
      },
    ],
  },
  {
    path: '/login',
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: '/register',
    element: <PublicRoute><Register /></PublicRoute>,
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes; 