import React, { useEffect, useState } from 'react';
import { Tree, Card, Button, Table, Modal, Form, Input, Select, Space, message, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { MenuItem } from '../../../types/menu';
import { getMenuList, createMenu, updateMenu, deleteMenu } from '../../../services/menu';

const { Option } = Select;

const MenuManagement: React.FC = () => {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const fetchMenuList = async () => {
    try {
      setLoading(true);
      const data = await getMenuList();
      setMenuList(data);
    } catch (error) {
      message.error('获取菜单列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuList();
  }, []);

  const handleAdd = () => {
    setSelectedMenu(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (menu: MenuItem) => {
    setSelectedMenu(menu);
    form.setFieldsValue(menu);
    setModalVisible(true);
  };

  const handleDelete = async (menu: MenuItem) => {
    try {
      await deleteMenu(menu.id);
      message.success('删除成功');
      fetchMenuList();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        order: Number(values.order),
      };

      if (selectedMenu) {
        await updateMenu(selectedMenu.id, formData);
        message.success('更新成功');
      } else {
        await createMenu(formData);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchMenuList();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const treeData = React.useMemo(() => {
    const convertToTreeData = (items: MenuItem[]): any[] => {
      return items.map(item => ({
        key: item.id,
        title: item.name,
        children: item.children ? convertToTreeData(item.children) : undefined,
      }));
    };
    return convertToTreeData(menuList);
  }, [menuList]);

  const findMenuById = (menus: MenuItem[], id: number): MenuItem | undefined => {
    for (const menu of menus) {
      if (menu.id === id) {
        return menu;
      }
      if (menu.children) {
        const found = findMenuById(menu.children, id);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="菜单管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增菜单
          </Button>
        }
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <Card style={{ width: 300 }} title="菜单树">
            <Tree
              treeData={treeData}
              defaultExpandAll
              onSelect={(_, { node }) => {
                const menu = findMenuById(menuList, node.key as number);
                if (menu) setSelectedMenu(menu);
              }}
            />
          </Card>
          <Card style={{ flex: 1 }} title="菜单详情">
            {selectedMenu ? (
              <div>
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(selectedMenu)}
                  >
                    编辑
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(selectedMenu)}
                  >
                    删除
                  </Button>
                </Space>
                <Table
                  columns={[
                    { title: '菜单名称', dataIndex: 'name' },
                    { title: '路径', dataIndex: 'path' },
                    { title: '图标', dataIndex: 'icon' },
                    { title: '排序', dataIndex: 'order' },
                    { title: '状态', dataIndex: 'status' },
                    { title: '类型', dataIndex: 'type' },
                  ]}
                  dataSource={[selectedMenu]}
                  pagination={false}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#999' }}>
                请选择左侧菜单项查看详情
              </div>
            )}
          </Card>
        </div>
      </Card>

      <Modal
        title={selectedMenu ? '编辑菜单' : '新增菜单'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="path" label="路径">
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input />
          </Form.Item>
          <Form.Item name="parentId" label="父级菜单">
            <Select allowClear>
              {menuList.map(menu => (
                <Option key={menu.id} value={menu.id}>
                  {menu.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="order"
            label="排序"
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}
          >
            <Select>
              <Option value="menu">菜单</Option>
              <Option value="button">按钮</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuManagement; 