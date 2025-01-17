import React from 'react';
import { Layout, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../stores/auth';
import useAuthStore from '../stores/useAuthStore';

const { Header } = Layout;

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const items = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Header style={{ 
      background: '#fff',
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 1,
    }}>
      <Dropdown menu={{ items }} placement="bottomRight">
        <div style={{ 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <UserOutlined />
          <span>{user?.username}</span>
        </div>
      </Dropdown>
    </Header>
  );
};

export default HeaderComponent; 