import React from 'react';
import { Layout, Dropdown } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Sider from './Sider';
import useAuthStore from '../stores/useAuthStore';

const { Content, Header } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  min-height: 280px;
  background: #f0f2f5;
`;

const UserInfo = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: #1890ff;
  }
`;

const MainContainer = styled(Layout)`
  /* margin-left: 200px; */
`;

const MainLayout: React.FC = () => {
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
    <StyledLayout>
      <Sider />
      <MainContainer>
        <StyledHeader>
          <Dropdown menu={{ items }} placement="bottomRight">
            <UserInfo>
              <UserOutlined />
              <span>{user?.username}</span>
            </UserInfo>
          </Dropdown>
        </StyledHeader>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </MainContainer>
    </StyledLayout>
  );
};

export default MainLayout; 