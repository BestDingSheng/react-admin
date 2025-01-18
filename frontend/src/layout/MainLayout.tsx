import React, { useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { Outlet } from 'react-router-dom';
import Sider from '@/layout/Sider';
import Header from '@/layout/Header';
import useAuthStore from '@/stores/useAuthStore';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const { fetchCurrentUser, loading } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, []); // 只在组件挂载时执行一次

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#f0f2f5'
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider />
      <Layout>
        <Header />
        <Content style={{ margin: '24px 16px', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 