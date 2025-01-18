import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';

interface AuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const location = useLocation();
  const { userMenus } = useAuthStore();

  // 检查当前路径是否在用户的权限菜单中
  const hasPermission = (path: string) => {
  
    return userMenus.some(menu => {
      if (menu.path === path) return true;
      // 检查子菜单
      if (menu.children) {
        return menu.children.some((child: any) => child.path === path);
      }
      return false;
    });
  };

  // 如果用户没有权限访问当前路径，重定向到 403 页面
  // if (!hasPermission(location.pathname)) {
  //   return <Navigate to="/403" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
};

export default AuthRoute; 