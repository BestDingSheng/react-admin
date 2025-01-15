import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Table, Space, Modal, message, Switch, Row, Col, Tree } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';
import { getRoles, createRole, updateRole, deleteRole, updateRoleMenus, getMenus } from '../../../services/role';
import type { Role } from '../../../types/role';
import type { Menu } from '../../../types/menu';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const RoleManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Role[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Role | null>(null);
  const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

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
      ...(values.id ? { id: values.id } : {}),
      ...(values.name ? { name: values.name } : {}),
    };
    await fetchRoles();
  };

  // 处理编辑
  const handleEdit = (record: Role) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      isActive: record.isActive,
    });
    // 设置已选中的菜单ID
    const menuIds = record.menus?.map(menu => menu.id) || [];
    setSelectedMenuIds(menuIds);
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
          fetchRoles();
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
        // 更新角色基本信息
        await updateRole(editingRecord.id, {
          name: values.name,
          description: values.description,
          isActive: values.isActive,
        });

        // 更新角色菜单
        if (values.menuIds && values.menuIds.length > 0) {
          await updateRoleMenus(editingRecord.id, values.menuIds);
        }

        message.success('更新成功');
        setIsModalVisible(false);
        form.resetFields();
        setEditingRecord(null);
        setSelectedMenuIds([]);
        fetchRoles();
      }
    } catch (error: any) {
      message.error(error.message || '更新失败');
    }
  };

  // 处理菜单选择
  const handleMenuCheck = (checked: number[]) => {
    setSelectedMenuIds(checked);
  };

  return (
    <div className="role-management">
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            onFinish={handleSearch}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="id" label="角色ID">
                  <Input placeholder="请输入角色ID" allowClear />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="name" label="角色名称">
                  <Input placeholder="请输入角色名称" allowClear />
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
                        fetchRoles();
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
        title="编辑角色"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingRecord(null);
          setSelectedMenuIds([]);
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
            name="name"
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
            name="menuIds"
            label="菜单权限"
            required
            initialValue={selectedMenuIds}
          >
            <Tree
              checkable
              treeData={convertMenusToTreeData(menus)}
              checkedKeys={selectedMenuIds}
              defaultExpandAll
              onCheck={(checked) => {
                handleMenuCheck(checked as number[]);
                form.setFieldsValue({ menuIds: checked });
              }}
            />
          </Form.Item>
          <Form.Item
            name="isActive"
            label="状态"
            valuePropName="checked"
            initialValue={true}
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
                  setSelectedMenuIds([]);
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

export default RoleManagement; 