import { ReactNode, useEffect, useState } from 'react';
import { ProCard, ProColumns, ProTable, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, message, Drawer, Form, Input, Select } from 'antd';
import { config } from '../../config.tsx'


interface User {
    id: number;
    name: string;
    mail: string;
    role: string;
    phone: string;
}

function Page() {
    const [MsgApi, contextHolder] = message.useMessage();
    const [datasource, setDatasource] = useState([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<{ name: string }[]>([]);
    const [showAddUserDrawer, setShowAddUserDrawer] = useState(false);

    useEffect(() => {
        getData()
        getRoles().then(r => {
            setRoles(r)
        })
    }, [MsgApi]);

    const getData = () => {
        fetch(config.API_URL + '/api/v1/auth/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then(response => {
            if (response.ok) {
                response.json().then((data: { data: never, status: number, msg: string }) => {
                    if (data.status != 0) {
                        MsgApi.error(data.msg);
                    } else {
                        setDatasource(data.data);
                    }
                });
            }
        });
    }
    const handleDelete = (id: number) => {
        fetch(config.API_URL + '/api/v1/auth/user?id=' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then(
            async response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        const data = await response.json();
                        if (data.msg) {
                            MsgApi.destroy();
                            MsgApi.error(data.msg)
                        }
                    }
                }
                return response.json();
            }
        ).then(data => {
            if (data.status === 0) {
                MsgApi.success("删除用户成功");
                setDatasource(datasource.filter((item: User) => item.id !== id));
                setDatasource(datasource.filter((item: User) => item.id !== id));
            } else {
                MsgApi.error(data.msg);
            }
        })
    };

    const handleEdit = (record: User) => {
        setSelectedUser(record);
    };
    const columns: ProColumns<User>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '用户名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '邮箱',
            dataIndex: 'mail',
            key: 'mail',
        },
        {
            title: '角色',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '操作',
            key: 'action',
            valueType: 'option',
            render: (_dom: ReactNode, record: User) => (
                <>
                    <Button onClick={() => {
                        // 编辑用户
                        handleEdit(record)
                    }} style={{ marginRight: 8 }}>编辑</Button>
                    <Popconfirm
                        title="确定要删除用户吗?"
                        onConfirm={() => {
                            // 删除用户
                            handleDelete(record.id)
                        }}
                    >
                        <Button>删除</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const handleUpdate = (values: User) => {
        let newUser = { ...selectedUser };
        newUser.name = values.name;
        newUser.mail = values.mail;
        newUser.phone = values.phone;
        newUser.role = values.role;

        fetch(config.API_URL + "/api/v1/auth/user", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        }).then(response => {
            response.json().then(data => {
                if (data.status != 0) {
                    MsgApi.error("更新用户成功");
                } else {
                    MsgApi.success(data.msg);
                    getData()
                    setSelectedUser(null)
                }
            });
        });
    }

    const getRoles = async (): Promise<{ name: string }[]> => {
        const response = await fetch(config.API_URL + '/api/v1/auth/role', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.status != 0) {
            MsgApi.error(data.msg);
        }
        let rolesname = []
        for (let i = 0; i < data.data.length; i++) {
            rolesname.push({ name: data.data[i].name })
        }
        console.log(rolesname)
        return rolesname;
    }

    const handleAddUser = (values: { name: string, password: string, confirmPassword: string, mail?: string, phone?: string }) => {
        if (!values.name) {
            MsgApi.error("用户名不能为空");
            return;
        }
        if (!values.password) {
            MsgApi.error("密码不能为空");
            return;
        }
        if (values.password !== values.confirmPassword) {
            MsgApi.error("两次密码不一致");
            return;
        }
        if (values.mail && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.mail)) {
            MsgApi.error("邮箱格式不正确");
            return;
        }
        if (values.phone && !/^\d{10,15}$/.test(values.phone)) {
            MsgApi.error("手机号格式不正确");
            return;
        }

        fetch(config.API_URL + "/api/v1/auth/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        }).then(response => {
            response.json().then(data => {
                if (data.status != 0) {
                    MsgApi.error(data.msg);
                } else {
                    MsgApi.success("添加用户成功");
                    getData();
                    setShowAddUserDrawer(false);
                }
            });
        });
    }

    return (
        <>
            {contextHolder}
            <ProCard style={{ padding: 10 }}>
                <ProTable<User>
                    columns={columns}
                    dataSource={datasource}
                    rowKey="id"
                    pagination={{
                        showQuickJumper: true,
                        pageSize: 5,
                    }}
                    search={false}
                    toolbar={{
                        actions: [
                            <Button
                                key="addRole"
                                type="primary"
                                onClick={() => {
                                    setShowAddUserDrawer(true);
                                }}
                            >
                                增加角色
                            </Button>
                        ]
                    }}
                />
            </ProCard>
            {
                selectedUser && (
                    <Drawer
                        title={`编辑用户 - ${selectedUser.name}`}
                        open={selectedUser ? true : false}
                        onClose={() => setSelectedUser(null)}
                        width={500}
                    >
                        <Form
                            layout="vertical"
                            initialValues={selectedUser}
                            onFinish={(values) => {
                                // 提交编辑后的用户信息
                                handleUpdate(values);
                            }}
                        >
                            <Form.Item
                                label="用户名"
                                name="name"
                                rules={[{ required: true, message: '请输入用户名' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="邮箱"
                                name="mail"
                                rules={[{ required: false, message: '请输入邮箱' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="电话"
                                name="phone"
                                rules={[{ required: false, message: '请输入电话' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="角色"
                                name="role"
                                rules={[{ required: true, message: '请选择角色' }]}
                            >
                                <Select>
                                    {roles.map((role: { name: string }) => (
                                        <Select.Option key={role.name} value={role.name}>
                                            {role.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </Drawer>
                )
            } {
                showAddUserDrawer && (
                    <Drawer
                        title="增加用户"
                        open={showAddUserDrawer}
                        onClose={() => setShowAddUserDrawer(false)}
                        width={500}
                    >
                        <ProForm
                            onFinish={handleAddUser}
                            submitter={false}
                        >
                            <ProFormText
                                name="name"
                                label="用户名"
                                placeholder="请输入用户名"
                                required={true}
                                style={{ marginBottom: 24 }}
                            />
                            <ProFormText
                                name="mail"
                                label="邮箱"
                                placeholder="请输入邮箱"
                                style={{ marginBottom: 24 }}
                            />
                            <ProFormText
                                name="phone"
                                label="电话"
                                placeholder="请输入电话"
                                style={{ marginBottom: 24 }}
                            />
                            <ProFormSelect
                                name="role"
                                label="角色"
                                placeholder="请选择角色"
                                style={{ marginBottom: 24 }}
                                options={roles.map((role: { name: string }) => ({
                                    label: role.name,
                                    value: role.name
                                }))}
                            />
                            <ProFormText
                                name="password"
                                label="密码"
                                placeholder="请输入密码"
                                style={{ marginBottom: 24 }}
                            />
                            <ProFormText
                                name="confirmPassword"
                                label="确认密码"
                                placeholder="请确认密码"
                                style={{ marginBottom: 24 }}
                            />
                            <Button htmlType="submit">添加用户</Button>
                        </ProForm>
                    </Drawer>
                )
            }
        </>
    );
}

export default Page;