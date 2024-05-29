import {ReactNode, useEffect, useState} from 'react';
import {ProColumns, ProTable} from '@ant-design/pro-components';
import {Button, Popconfirm, message} from 'antd';
import {config} from '../../config.tsx';


interface User {
    id: number;
    name: string;
    mail: string;
}

function Page() {
    const [datasource, setDatasource] = useState([]);

    useEffect(() => {
        fetch(config.API_URL + '/api/v1/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('SESSION') || '',
            },
        }).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    setDatasource(data);
                });
            }
        });
    }, []);

    const handleDelete = (id: number) => {
        // Implement delete logic here, possibly calling an API and then updating the state
        fetch(config.API_URL + '/api/v1/auth/user?id=' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('SESSION') || '',
            },

        })
        message.success('用户已删除');
        setDatasource(datasource.filter((item: User) => item.id !== id));
    };

    const handleEdit = (record: User) => {
        // You can set up a modal form for editing here
        message.info(`正在编辑 ${record.name}`);
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
            <ProTable
                columns={columns}
                dataSource={datasource}
                rowKey="id"
                pagination={{
                    showQuickJumper: true,
                    pageSize: 5,
                }}
                search={false}
            />
        </>
    );
}

export default Page;