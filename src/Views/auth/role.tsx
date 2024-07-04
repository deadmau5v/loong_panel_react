import {ProCard, ProColumns, ProTable, ProForm, ProFormFieldSet, ProFormText} from "@ant-design/pro-components";
import {Button, Drawer, message, Popconfirm} from "antd";
import {useEffect, useState} from "react";
import {config} from "../../config.tsx";

type Policy = {
    role: string;
    method: string;
    path: string;
}

type Role = {
    name: string;
    policy_list: Policy[];
}

function Page() {
    const [MsgApi, contextHolder] = message.useMessage();

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
                        style={{marginRight: 8}}
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
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button onClick={() => handleDeletePolicy(record)}>删除</Button>
            ),
        }
    ];

    const [datasource, setDatasource] = useState<Role[]>([]);
    const [visible, setVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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
                    setDatasource(data);
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

    const handleAddPolicy = ({newPolicy}: { newPolicy: string[] }) => {
        if (selectedRole) {

            const p: Policy = {
                method: newPolicy[0],
                path: newPolicy[1],
                role: selectedRole.name
            }

            fetch(config.API_URL + '/api/v1/auth/policy', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                method: 'POST',
                body: JSON.stringify(p)
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
                policy_list: [...selectedRole.policy_list, p]
            });
        }
    };

    return (
        <>
            {contextHolder}
            <ProCard style={{padding: 10}}>
                <ProTable<Role>
                    columns={columns}
                    dataSource={datasource}
                    rowKey="name"
                    pagination={{
                        showQuickJumper: true,
                        pageSize: 5,
                    }}
                    search={false}
                    toolbar={{style: {padding: 0, height: 0}}}
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
                            toolbar={{style: {padding: 0, height: 0}}}
                            // 隐藏工具栏
                        />

                        {/* 添加策略表单 */}
                        <ProForm
                            onFinish={handleAddPolicy}
                            submitter={false}
                        >
                            <ProFormFieldSet name="newPolicy" style={{marginBottom: 24}}>
                                <ProFormText width="md" name="method" label="方法" placeholder="请输入方法"/>
                                <ProFormText width="md" name="path" label="路径" placeholder="请输入路径"/>
                            </ProFormFieldSet>
                            <Button htmlType="submit">添加策略</Button>
                        </ProForm>
                    </Drawer>
                )}
            </ProCard>
        </>
    );
}

export default Page;