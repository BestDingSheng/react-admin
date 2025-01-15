import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  MenuOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useAuthStore from '../../stores/useAuthStore';
import type { MenuProps } from 'antd';

const { Sider: AntSider } = Layout;

const StyledSider = styled(AntSider)`
  .ant-layout-sider-children {
    height: 100vh;
    position: fixed;
    width: 200px;
  }
`;

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: 'system',
    icon: <SettingOutlined />,
    label: '系统管理',
    children: [
      {
        key: 'system/menu',
        icon: <MenuOutlined />,
        label: '菜单管理',
      },
      {
        key: 'system/role',
        icon: <MenuOutlined />,
        label: '角色管理',
      },
      {
        key: 'system/user',
        icon: <MenuOutlined />,
        label: '用户管理',
      },
    ],
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

const Sider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'dashboard';
  const logout = useAuthStore((state) => state.logout);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/login');
      return;
    }
    navigate(`/${key}`);
  };

  return (
    <StyledSider width={200}>
      <div style={{ padding: '16px', color: 'white', fontSize: '18px', textAlign: 'center' }}>
        管理系统
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname.slice(1)]}
        defaultOpenKeys={['system']}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </StyledSider>
  );
};

export default Sider; 