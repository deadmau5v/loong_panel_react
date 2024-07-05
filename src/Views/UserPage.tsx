import { Layout, Button, Card, Form, Input, Typography, Descriptions, message } from 'antd';
import { useEffect, useState } from "react";
import { config } from "../config.tsx";
import { ProCard } from "@ant-design/pro-components";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export interface Request {
    msg: string;
    data: Data;
    status: number;
}

export interface Data {
    id: number;
    mail: string;
    name: string;
    phone: string;
    role: string;
    last_login_time: string;
    last_login_ip: string;
}

function clearCookie(): void {
    document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
}

async function fetchData(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    return response.json();
}

export default function Component() {
    const [data, setData] = useState<Data | null>(null);

    useEffect(() => {
        fetchData(config?.API_URL + "/api/v1/auth/user", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        }).then((res: Request) => {
            setData(res.data);
        });
    }, []);

    async function changePasswordHandler(values: { password: string, confirmPassword: string }) {
        if (values.password !== values.confirmPassword) {
            message.error("两次密码不一致");
        } else if (values.confirmPassword.length < 8 || values.confirmPassword.length > 20) {
            message.error("密码长度不能小于8大于20");
        } else {
            const res: Request = await fetchData(config?.API_URL + "/api/v1/auth/password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ password: values.password })
            });
            if (res.status != 0) {
                message.error(res.msg);
            } else {
                message.success("修改成功");
            }
        }
    }

    async function handleLogout() {
        await fetch(config?.API_URL + "/api/v1/auth/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });
        document.cookie = "";
        localStorage.clear();
        clearCookie();
        window.location.href = "/";
    }

    return (
        <ProCard>
            <Content style={{ padding: '24px' }}>
                <Header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    padding: '0 0 24px 0'
                }}>
                    <Title level={2}>用户后台</Title>
                    <Button onClick={handleLogout}>退出</Button>
                </Header>

                <Card title="用户信息">
                    <Descriptions column={1} size="small" bordered>
                        <Descriptions.Item label="ID">
                            <Text type="secondary">{data?.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="用户名">
                            <Text type="secondary">{data?.name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="邮箱">
                            <Text type="secondary">{data?.mail}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="电话">
                            <Text type="secondary">{data?.phone}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="角色">
                            <Text type="secondary">{data?.role}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
                <Card title="修改密码">
                    <Form layout="vertical" onFinish={changePasswordHandler}>
                        <Form.Item label="新密码" name="password">
                            <Input.Password name="password" />
                        </Form.Item>
                        <Form.Item label="确认密码" name="confirmPassword">
                            <Input.Password name="confirmPassword" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Form>
                </Card>
                <Card title="查看最后一次登录">
                    <Descriptions column={1} size="small" bordered>
                        <Descriptions.Item label="最后一次登录时间">
                            <Text type="secondary">{data?.last_login_time}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="最后一次登录IP">
                            <Text type="secondary">{data?.last_login_ip}</Text>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </Content>
        </ProCard>
    );
}