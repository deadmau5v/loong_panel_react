import { ProCard, ProColumns, ProTable, ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { Button, Drawer, message, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { config } from "../../config.tsx";

type Policy = {
    role: string;
    method: string;
    path: string;
    comment: string;
}

type Role = {
    name: string;
    policy_list: Policy[];
}

function Page() {
    const [MsgApi, contextHolder] = message.useMessage();
    const [datasource, setDatasource] = useState<Role[]>([]);
    const [visible, setVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [showAddRoleDrawer, setShowAddRoleDrawer] = useState(false);

    const columns: ProColumns<Role>[] = [
        {
            title: '角色名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => showDrawer(record)}
                        style={{ marginRight: 8 }}
                    >编辑</Button>

                    <Popconfirm
                        title="确定要删除用户吗?"
                        onConfirm={() => {
                            handleDelete(record)
                        }}
                    >
                        <Button>删除</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    const handleDelete = (role: Role) => {
        MsgApi.open({
            type: "loading",
            content: "删除角色: " + role.name + "中",
        });

        fetch(config.API_URL + '/api/v1/auth/role?name=' + role.name, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        })
            .then(async response => {
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
            })
            .then(data => {
                if (data.status === 0) {
                    MsgApi.success("删除角色: " + role.name + "成功");
                    setDatasource(datasource.filter(r => r.name !== role.name));
                    MsgApi.destroy()
                } else {
                    MsgApi.error(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }

    const policyColumns: ProColumns<Policy>[] = [
        {
            title: '方法',
            dataIndex: 'method',
            key: 'method',
        },
        {
            title: '路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '描述',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => handleDeletePolicy(record)}>删除</Button>
            ),
        }
    ];



    useEffect(() => {
        fetch(config.API_URL + '/api/v1/auth/role', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setDatasource(data.data);
                });
            }
        });
    }, []);

    const showDrawer = (record: Role) => {
        setSelectedRole(record);
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const handleDeletePolicy = (policy: Policy) => {
        if (selectedRole) {
            fetch(config.API_URL + '/api/v1/auth/policy', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify(policy)
            }).then(r => r.json()).then(
                (data: { status: number, msg: string }) => {
                    if (data.status != 0) {
                        MsgApi.error(data.msg);
                    } else {
                        MsgApi.success("删除策略成功");
                    }
                }
            );
            setSelectedRole({
                ...selectedRole,
                policy_list: selectedRole.policy_list.filter(p => p.path !== policy.path)
            });
        }
    };

    const handleAddPolicy = ({ inputPolicy }: { inputPolicy: string }) => {
        const newPolicy: Policy = {
            comment: inputPolicy.split(" ")[0],
            method: inputPolicy.split(" ")[1],
            path: inputPolicy.split(" ")[2],
            role: selectedRole?.name || ""
        }

        for (const policy of selectedRole?.policy_list || []) {
            if (policy.path === inputPolicy.split(" ")[2] && policy.method === inputPolicy.split(" ")[1]) {
                MsgApi.warning("策略已存在 无需重复添加");
                return;
            }
        }

        if (selectedRole) {

            console.log(newPolicy)
            fetch(config.API_URL + '/api/v1/auth/policy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify(newPolicy)
            }).then(r => r.json()).then(
                (data: { status: number, msg: string }) => {
                    if (data.status != 0) {
                        MsgApi.error(data.msg);
                    } else {
                        MsgApi.success("添加策略成功");
                    }
                }
            );

            setSelectedRole({
                ...selectedRole,
                policy_list: [...selectedRole.policy_list, newPolicy]
            });
        }
    };

    const handleAddRole = ({ role }: { role: string }) => {
        fetch(config.API_URL + '/api/v1/auth/role?name=' + role, {
            method: 'POST',
            credentials: "include"
        }).then(r => r.json()).then(
            (data: { status: number, msg: string }) => {
                if (data.status != 0) {
                    MsgApi.error(data.msg);
                } else {
                    MsgApi.success("添加角色成功");
                    setShowAddRoleDrawer(false);
                    setDatasource([...datasource, { name: role, policy_list: [] }]);
                }
            }
        );
    }

    return (
        <>
            {contextHolder}
            <ProCard style={{ padding: 10 }}>
                <ProTable<Role>
                    columns={columns}
                    dataSource={datasource}
                    rowKey="name"
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
                                    setShowAddRoleDrawer(true);
                                }}
                            >
                                增加角色
                            </Button>
                        ]
                    }}
                />
                {selectedRole && (
                    <Drawer
                        title={`策略详情 - ${selectedRole.name}`}
                        placement="right"
                        onClose={onClose}
                        open={visible}
                        width={500}
                    >
                        <ProTable<Policy>
                            columns={policyColumns}
                            dataSource={selectedRole.policy_list}
                            rowKey="path"
                            pagination={false}
                            search={false}
                            toolbar={{ style: { padding: 0, height: 0 } }}
                        // 隐藏工具栏
                        />

                        {/* 添加策略表单 */}
                        <ProForm
                            onFinish={handleAddPolicy}
                            submitter={false}
                        >
                            <ProFormSelect
                                name="inputPolicy"
                                label="选择策略"
                                options={datasource.find(role => role.name === 'admin')?.policy_list.map(policy => ({
                                    label: `${policy.comment}`,
                                    value: `${policy.comment} ${policy.method} ${policy.path}`
                                }))}
                                placeholder="请选择策略"
                                style={{ marginBottom: 24 }}
                            />
                            <Button htmlType="submit">添加策略</Button>
                        </ProForm>
                    </Drawer>
                )}
                {showAddRoleDrawer && (
                    <Drawer
                        title="增加角色"
                        placement="right"
                        onClose={() => setShowAddRoleDrawer(false)}
                        open={showAddRoleDrawer}
                        width={500}
                    >
                        <ProForm
                            onFinish={handleAddRole}
                            submitter={false}
                        >
                            <ProFormText
                                name="role"
                                label="角色名"
                                placeholder="请输入角色名"
                                style={{ marginBottom: 24 }}
                            />
                            <Button htmlType="submit">添加角色</Button>
                        </ProForm>
                    </Drawer>
                )}
            </ProCard>
        </>
    );
}

export default Page;