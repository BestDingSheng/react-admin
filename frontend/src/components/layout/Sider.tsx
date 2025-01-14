import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TableOutlined,
  FileOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useAuthStore from '../../stores/useAuthStore';

const { Sider: AntSider } = Layout;

const StyledSider = styled(AntSider)`
  .ant-layout-sider-children {
    height: 100vh;
    position: fixed;
    width: 200px;
  }
`;

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
//   {
//     key: 'form',
//     icon: <FileOutlined />,
//     label: '表单页',
//   },
//   {
//     key: 'table',
//     icon: <TableOutlined />,
//     label: '列表页',
//   },
//   {
//     key: 'detail',
//     icon: <CheckCircleOutlined />,
//     label: '详情页',
//   },
//   {
//     key: 'exception',
//     icon: <WarningOutlined />,
//     label: '异常页',
//   },
//   {
//     key: 'profile',
//     icon: <UserOutlined />,
//     label: '个人页',
//   },
//   {
//     key: 'logout',
//     icon: <LogoutOutlined />,
//     label: '退出登录',
//   },
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
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </StyledSider>
  );
};

export default Sider; 