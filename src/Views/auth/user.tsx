import {ReactNode, useEffect, useState} from 'react';
import {ProCard, ProColumns, ProTable} from '@ant-design/pro-components';
import {Button, Popconfirm, message, Drawer} from 'antd';
import {config} from '../../config.tsx'


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

    useEffect(() => {
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
    }, [MsgApi]);

    const handleDelete = (id: number) => {
        // Implement delete logic here, possibly calling an API and then updating the state
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
        // You can set up a modal form for editing here
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
                    }} style={{marginRight: 8}}>编辑</Button>
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

    return (
        <>
            {contextHolder}
            <ProCard style={{padding: 10}}>
                <ProTable
                    columns={columns}
                    dataSource={datasource}
                    rowKey="id"
                    toolbar={{style: {padding: 0, height: 0}}}
                    pagination={{
                        showQuickJumper: true,
                        pageSize: 5,
                    }}
                    search={false}
                />
            </ProCard>
            {
                selectedUser && (
                    <Drawer
                        title={`编辑用户 - ${selectedUser.name}`}
                        open={true}
                        onClose={() => setSelectedUser(null)}
                        width={500}
                    >
                    </Drawer>
                )
            }
        </>
    );
}

export default Page;