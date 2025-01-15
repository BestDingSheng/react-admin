import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Space, Modal, message, Switch } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getRoles, createRole, updateRole, deleteRole } from '../../../services/role';
import type { RoleData } from '../../../services/role';

const RoleManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RoleData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RoleData | null>(null);

  // 获取角色列表
  const fetchRoles = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getRoles(params);
      setData(response.result);
    } catch (error: any) {
      message.error(error.message || '获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchRoles();
  }, []);

  // 表格列定义
  const columns: ColumnsType<RoleData> = [
    {
      title: '角色ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: boolean, record) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
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
    await fetchRoles(values);
  };

  // 处理状态变更
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      await updateRole(id, { status });
      message.success('状态更新成功');
      fetchRoles(searchForm.getFieldsValue());
    } catch (error: any) {
      message.error(error.message || '状态更新失败');
    }
  };

  // 处理编辑
  const handleEdit = (record: RoleData) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个角色吗？',
      onOk: async () => {
        try {
          await deleteRole(id);
          message.success('删除成功');
          fetchRoles(searchForm.getFieldsValue());
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
        await updateRole(editingRecord.id, values);
        message.success('更新成功');
      } else {
        await createRole(values);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
      fetchRoles(searchForm.getFieldsValue());
    } catch (error: any) {
      message.error(error.message || (editingRecord ? '更新失败' : '创建失败'));
    }
  };

  return (
    <div className="role-management">
      {/* 搜索表单 */}
      <Card style={{ marginBottom: 16 }}>
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
        >
          <Form.Item name="roleId" label="角色ID">
            <Input placeholder="请输入角色ID" />
          </Form.Item>
          <Form.Item name="roleName" label="角色名称">
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button onClick={() => {
                searchForm.resetFields();
                fetchRoles();
              }}>
                重置
              </Button>
              <Button type="primary" onClick={() => setIsModalVisible(true)}>
                创建角色
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card>
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
        />
      </Card>

      {/* 创建/编辑表单模态框 */}
      <Modal
        title={editingRecord ? '编辑角色' : '创建角色'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingRecord(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="roleName"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRecord ? '更新' : '创建'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
                setEditingRecord(null);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement; 