import { useEffect, useState } from "react";
import { config } from "../config"
import { message, Button, Drawer, InputNumber } from 'antd';
import { ProTable, ProForm, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-components';

type UserNotificationSetting = {
    ID: number;
    user_id: number;
    notify_interval: number;
    notify_on_cpu: boolean;
    max_cpu: number;
    notify_on_ram: boolean;
    max_ram: number;
    clamav_scan_notify: boolean;
    inspection_notify: boolean;
}

type User = {
    id: number;
    name: string;
    mail: string;
}

export default function Page() {
    const [settings, setSettings] = useState<UserNotificationSetting[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [showAddNoticeDrawer, setShowAddNoticeDrawer] = useState(false);
    const [showEditNoticeDrawer, setShowEditNoticeDrawer] = useState(false);
    const [selectSetting, setSelectSetting] = useState<UserNotificationSetting | null>(null);

    // 获取用户通知设置
    const getSettings = () => {
        fetch(config.API_URL + "/api/v1/notice/notices").then(res => res.json()).then(data => {
            if (data.status != 0) {
                message.error(data.msg);
            } else {
                setSettings(data.data);
                console.log(data.data);
            }
        })
    }

    const getAllUsers = () => {
        fetch(config.API_URL + "/api/v1/auth/users").then(res => res.json()).then(data => {
            if (data.status != 0) {
                message.error(data.msg);
            } else {
                setUsers(data.data);
                console.log(data.data);
            }
        })
    }

    const addNotice = ({ userID }: { userID: number }) => {
        fetch(config.API_URL + "/api/v1/notice/notice?userID=" + userID, {
            method: "POST",
        }).then(res => res.json()).then(data => {
            if (data.status != 0) {
                message.error(data.msg);
            } else {
                message.success("添加成功");
                getSettings();
            }
        })
    }

    const deleteNotice = (setting: UserNotificationSetting) => {
        fetch(config.API_URL + "/api/v1/notice/notice", {
            method: "DELETE",
            body: JSON.stringify(setting),
        }).then(res => res.json()).then(data => {
            if (data.status != 0) {
                message.error(data.msg);
            } else {
                message.success("删除成功");
                getSettings();
            }
        })
    }

    const updateNotice = (values: any) => {
        fetch(config.API_URL + "/api/v1/notice/notice", {
            method: "PUT",
            body: JSON.stringify(values),
        }).then(res => res.json()).then(data => {
            if (data.status != 0) {
                message.error(data.msg);
            } else {
                message.success("更新成功");
                getSettings();
            }
        })
    }

    useEffect(() => {
        getAllUsers();
        getSettings();
    }, []);

    return (
        <>
            <ProTable<UserNotificationSetting>
                columns={[
                    {
                        title: '用户',
                        dataIndex: 'user_id',
                        render: (_, record) => {
                            const user = users.find(u => u.id === record.user_id);
                            return user ? user.name : '未知用户';
                        }
                    },
                    {
                        title: 'CPU告警',
                        dataIndex: 'notify_on_cpu',
                        render: (_, record) => (
                            <>
                                <span style={{ color: record.notify_on_cpu ? 'green' : 'gray' }}>●</span>
                                {record.notify_on_cpu ? '  开启' : '  关闭'}
                            </>
                        )
                    },
                    {
                        title: 'CPU 警告阈值',
                        dataIndex: 'max_cpu',
                        render: (_, record) => `${record.max_cpu}%`
                    },
                    {
                        title: '内存告警',
                        dataIndex: 'notify_on_ram',
                        render: (_, record) => (
                            <>
                                <span style={{ color: record.notify_on_ram ? 'green' : 'gray' }}>●</span>
                                {record.notify_on_ram ? '  开启' : '  关闭'}
                            </>
                        )
                    },
                    {
                        title: 'RAM 警告阈值',
                        dataIndex: 'max_ram',
                        render: (_, record) => `${record.max_ram}%`
                    },
                    {
                        title: '最小通知间隔(分钟)',
                        dataIndex: 'notify_interval'
                    },
                    {
                        title: '病毒扫描告警',
                        dataIndex: 'clamav_scan_notify',
                        render: (_, record) => (
                            <>
                                <span style={{ color: record.clamav_scan_notify ? 'green' : 'gray' }}>●</span>
                                {record.clamav_scan_notify ? '  开启' : '  关闭'}
                            </>
                        )
                    },
                    {
                        title: '巡检通知',
                        dataIndex: 'inspection_notify',
                        render: (_, record) => (
                            <>
                                <span style={{ color: record.inspection_notify ? 'green' : 'gray' }}>●</span>
                                {record.inspection_notify ? '  开启' : '  关闭'}
                            </>
                        )
                    },
                    {
                        title: "操作",
                        render: (_, record) => (
                            <>
                                <Button
                                    type="link" onClick={() => {
                                        setSelectSetting(record);
                                        setShowEditNoticeDrawer(true);
                                    }}>
                                    编辑
                                </Button>
                                <Button
                                    type="link"
                                    onClick={() => {
                                        deleteNotice(record);
                                    }}
                                >
                                    删除
                                </Button>
                            </>
                        )
                    }
                ]}
                dataSource={settings}
                rowKey="ID"
                search={false}
                toolbar={{
                    actions: [
                        <Button type="primary" onClick={() => {
                            setShowAddNoticeDrawer(true);
                        }}>
                            增加预警设置
                        </Button>
                    ]
                }}
            />
            {
                showAddNoticeDrawer && (
                    <Drawer
                        title="增加预警设置"
                        open={showAddNoticeDrawer}
                        onClose={() => {
                            setShowAddNoticeDrawer(false);
                        }}
                    >
                        <ProForm
                            onFinish={async (values) => {
                                addNotice({ userID: values.user });
                            }}
                        >
                            <ProFormSelect
                                name="user"
                                label="用户"
                                options={users.map(user => ({ label: user.name, value: user.id }))}
                                placeholder="请选择用户"
                            />
                        </ProForm>
                    </Drawer>
                )
            } {
                showEditNoticeDrawer && (
                    <Drawer
                        title="编辑通知设置"
                        open={showEditNoticeDrawer}
                        onClose={() => {
                            setShowEditNoticeDrawer(false);
                        }}
                    >
                        <ProForm
                            onFinish={async (values) => {
                                console.log(values);
                                updateNotice(values);
                            }}
                            initialValues={selectSetting ? selectSetting : undefined}
                        >
                            <ProFormText
                                name="ID"
                                hidden
                            />
                            <ProFormSwitch
                                name="notify_on_cpu"
                                label="CPU告警"
                                placeholder="请选择是否开启CPU告警"
                            />
                            <ProFormSwitch
                                name="notify_on_ram"
                                label="内存告警"
                                placeholder="请选择是否开启内存告警"
                            />
                            <ProFormSwitch
                                name="clamav_scan_notify"
                                label="病毒扫描告警"
                                placeholder="请选择是否开启病毒扫描告警"
                            />
                            <ProFormSwitch
                                name="inspection_notify"
                                label="巡检告警"
                                placeholder="请选择是否开启巡检告警"
                            />
                            <ProForm.Item
                                name="notify_interval"
                                label="预警间隔"
                                rules={[{ required: true, message: '请输入预警间隔' }]}
                            >
                                <InputNumber min={1} placeholder="请输入预警间隔（分钟）" />
                            </ProForm.Item>
                            <ProForm.Item
                                name="max_cpu"
                                label="CPU警告值"
                                rules={[{ required: true, message: '请输入CPU警告值' }]}
                            >
                                <InputNumber min={1} max={100} placeholder="请输入CPU警告值（%）" />
                            </ProForm.Item>
                            <ProForm.Item
                                name="max_ram"
                                label="内存警告值"
                                rules={[{ required: true, message: '请输入内存警告值' }]}
                            >
                                <InputNumber min={1} max={100} placeholder="请输入内存警告值（%）" />
                            </ProForm.Item>
                        </ProForm>
                    </Drawer>
                )
            }
        </>
    )
}