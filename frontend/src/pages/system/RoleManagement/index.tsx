import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Space, Modal, message, Switch, Row, Col, Tree } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { getRoles, createRole, updateRole, deleteRole, updateRoleMenus, getMenus } from '@/services/role';
import type { Role } from '@/types/role';
import type { Menu } from '@/types/menu';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import useAuthStore from '@/stores/useAuthStore';

const RoleManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Role[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Role | null>(null);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
  const { fetchCurrentUser } = useAuthStore();

  // 获取角色列表
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      setData(response.result);
    } catch (error: any) {
      message.error(error.message || '获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取菜单列表
  const fetchMenus = async () => {
    try {
      const response = await getMenus();
      setMenus(response.result);
    } catch (error: any) {
      message.error(error.message || '获取菜单列表失败');
    }
  };

  // 初始加载
  useEffect(() => {
    fetchRoles();
    fetchMenus();
  }, []);

  // 将菜单数据转换为Tree组件需要的格式
  const convertMenusToTreeData = (menus: Menu[]): DataNode[] => {
    return menus.map(menu => ({
      title: menu.name,
      key: menu.id,
      children: menu.children ? convertMenusToTreeData(menu.children) : undefined,
      disabled: !menu.isActive,
    }));
  };

  // 显示新增/编辑模态框
  const showModal = (record?: Role) => {
    setEditingRecord(record || null);
    if (record) {
      form.setFieldsValue(record);
      setSelectedMenuIds(record.menus?.map(menu => menu.id) || []);
    } else {
      form.resetFields();
      setSelectedMenuIds([]);
    }
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        // 更新角色
        await updateRole(editingRecord.id, values);
        await updateRoleMenus(editingRecord.id, selectedMenuIds);
        message.success('角色更新成功');
      } else {
        // 创建角色
        const response = await createRole(values);
        if (selectedMenuIds.length > 0) {
          await updateRoleMenus(response.result.id, selectedMenuIds);
        }
        message.success('角色创建成功');
      }
      setIsModalVisible(false);
      await fetchRoles();
      // 更新当前用户信息和菜单
      await fetchCurrentUser();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    }
  };

  // 表格列定义
  const columns: ColumnsType<Role> = [
    {
      title: '角色ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Switch
          checked={isActive}
          checkedChildren="启用"
          unCheckedChildren="禁用"
          disabled
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
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      message.success('删除成功');
      fetchRoles();
    } catch (error: any) {
      message.error(error.message || '删除失败');
    }
  };

  // 处理菜单选择
  const handleMenuCheck = (checked: number[]) => {
    setSelectedMenuIds(checked);
  };

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 搜索表单 */}
        <Form form={searchForm} layout="inline">
          <Form.Item name="name" label="角色名称">
            <Input placeholder="请输入角色名称" allowClear />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={() => searchForm.resetFields()}>
                重置
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                新增角色
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 角色列表 */}
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

        {/* 新增/编辑模态框 */}
        <Modal
          title={editingRecord ? '编辑角色' : '新增角色'}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={800}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="角色名称"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input placeholder="请输入角色名称" />
            </Form.Item>
            <Form.Item name="description" label="角色描述">
              <Input.TextArea placeholder="请输入角色描述" />
            </Form.Item>
            <Form.Item name="isActive" label="状态" valuePropName="checked" initialValue={true}>
              <Switch checkedChildren="启用" unCheckedChildren="禁用" />
            </Form.Item>
            <Form.Item label="菜单权限">
              <Tree
                checkable
                checkedKeys={selectedMenuIds}
                onCheck={(checked: any) => {
                  // 如果是字符串数组，直接使用；如果是 { checked, halfChecked }，使用 checked
                  const checkedKeys = Array.isArray(checked) ? checked : checked.checked;
                  setSelectedMenuIds(checkedKeys);
                }}
                treeData={convertMenusToTreeData(menus)}
                defaultExpandAll
              />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </Card>
  );
};

export default RoleManagement; 