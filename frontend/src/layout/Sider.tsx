import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

const { Sider } = Layout;

// 默认菜单配置
const defaultMenus = [
  {
    key: '/dashboard',
    icon: <UserOutlined />,
    label: '仪表盘',
  },
  {
    key: '/system',
    icon: <VideoCameraOutlined />,
    label: '系统管理',
    children: [
      {
        key: '/system/user',
        label: '用户管理',
      },
      {
        key: '/system/role',
        label: '角色管理',
      },
      {
        key: '/system/menu',
        label: '菜单管理',
      },
    ],
  },
];

// 将后端菜单数据转换为 Antd Menu 需要的格式
const convertMenus = (menus: any[]): MenuProps['items'] => {
  return menus.map(menu => ({
    key: menu.path || '',
    icon: menu.icon ? React.createElement(eval(menu.icon)) : null,
    label: menu.name,
    children: menu.children && menu.children.length > 0 ? convertMenus(menu.children) : undefined,
  }));
};

const SiderComponent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { userMenus } = useAuthStore();

  useEffect(() => {
    // 根据当前路径设置选中的菜单项
    setSelectedKeys([location.pathname]);
    // 设置展开的子菜单
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const openMenuKeys = pathSegments.map((_, index) => 
      '/' + pathSegments.slice(0, index + 1).join('/')
    );
    setOpenKeys(openMenuKeys);
  }, [location.pathname]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  console.log('userMenus', userMenus)

  // 使用后端返回的菜单数据，如果没有则使用默认菜单
  const menuItems = userMenus && userMenus.length > 0 
    ? convertMenus(userMenus) 
    : defaultMenus;

    console.log('selectedKeys', selectedKeys)
    console.log('menuItems', menuItems)
    console.log('openKeys', openKeys)

  return (
    <Sider>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        items={menuItems}
      />
    </Sider>
  );
};

export default SiderComponent; 