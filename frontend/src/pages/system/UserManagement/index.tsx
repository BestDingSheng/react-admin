import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Space, Modal, message, Switch, Row, Col, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getUsers, updateUser, deleteUser, updateUserStatus } from '../../../services/user';
import { getRoles } from '../../../services/role';
import type { UserData } from '../../../services/user';
import type { Role } from '../../../types/role';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const UserManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<UserData | null>(null);

  // 获取用户列表
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getUsers(params);
      setData(response.result);
    } catch (error: any) {
      message.error(error.message || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      const response = await getRoles();
      setRoles(response.result);
    } catch (error: any) {
      message.error(error.message || '获取角色列表失败');
    }
  };

  // 初始加载
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // 表格列定义
  const columns: ColumnsType<UserData> = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      width: 150,
      render: (roles: string[]) => roles?.join(', ') || '-',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(record.id, checked)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  // 处理搜索
  const handleSearch = async (values: any) => {
    const params = {
      ...(values.userId ? { id: values.userId } : {}),
      ...(values.username ? { username: values.username } : {}),
      ...(values.email ? { email: values.email } : {})
    };
    await fetchUsers(params);
  };

  // 处理状态变更
  const handleStatusChange = async (id: number, isActive: boolean) => {
    try {
      await updateUserStatus(id, isActive);
      message.success('状态更新成功');
      fetchUsers(searchForm.getFieldsValue());
    } catch (error: any) {
      message.error(error.message || '状态更新失败');
    }
  };

  // 处理编辑
  const handleEdit = (record: UserData) => {
    setEditingRecord(record);
    form.setFieldsValue({
      email: record.email,
      isActive: record.isActive,
      roleIds: record.roles?.map(role => role.id) || []
    });
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个用户吗？',
      onOk: async () => {
        try {
          await deleteUser(id);
          message.success('删除成功');
          fetchUsers(searchForm.getFieldsValue());
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        await updateUser(editingRecord.id, values);
        message.success('更新成功');
        setIsModalVisible(false);
        form.resetFields();
        setEditingRecord(null);
        fetchUsers(searchForm.getFieldsValue());
      }
    } catch (error: any) {
      message.error(error.message || '更新失败');
    }
  };

  return (
    <div className="user-management">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            onFinish={handleSearch}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="userId" label="用户ID">
                  <Input placeholder="请输入用户ID" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="username" label="用户名">
                  <Input placeholder="请输入用户名" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="email" label="邮箱">
                  <Input placeholder="请输入邮箱" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                      查询
                    </Button>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        searchForm.resetFields();
                        fetchUsers();
                      }}
                    >
                      重置
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          scroll={{ x: 1300 }}
        />
      </Card>

      <Modal
        title="编辑用户"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingRecord(null);
        }}
        footer={null}
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="roleIds"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择角色"
              optionFilterProp="label"
              options={roles.map(role => ({
                label: role.name,
                value: role.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingRecord(null);
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  更新
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 