import {Layout, Button, Card, Avatar, Form, Input, Typography, Row, Col, Descriptions} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import {useEffect, useState} from "react";
import {config} from "../config.tsx";
import {ProCard} from "@ant-design/pro-components";

const {Header, Content} = Layout;
const {Title, Text} = Typography;

export interface Request {
    data: Data;
    status: number;
}

export interface Data {
    id: number;
    mail: string;
    name: string;
    password: string;
    phone: string;
    role: string;
    last_login_time: string;
    last_login_ip: string;
}

function clearCookie() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
}


export default function Component() {
    const [data, setData] = useState<Data | null>(null)

    useEffect(() => {
        fetch(config?.API_URL + "/api/v1/auth/user", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then((res: Request) => {
                setData(res.data)
            })
    }, [])

    return (
        <ProCard>
            <Content style={{padding: '24px'}}>
                <Header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    padding: '0 0 24px 0'
                }}>
                    <Title level={2}>用户后台</Title>
                    <Button onClick={async () => {
                        await fetch(config?.API_URL + "/api/v1/auth/logout", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: "include"
                        })
                        document.cookie = ""
                        localStorage.clear()
                        clearCookie()
                        window.location.href = "/"
                    }
                    }>退出</Button>
                </Header>
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={12} lg={8}>
                        <Card title="用户信息">
                            <Descriptions
                                column={1}
                                size="small"
                                bordered
                            >
                                <Descriptions.Item label="ID" children={
                                    <Text type="secondary">{data?.id}</Text>
                                }/>
                                <Descriptions.Item label="用户名" children={
                                    <Text type="secondary">{data?.name}</Text>
                                }/>
                                <Descriptions.Item label="邮箱" children={
                                    <Text type="secondary">{data?.mail}</Text>
                                }/>
                                <Descriptions.Item label="电话" children={
                                    <Text type="secondary">{data?.phone}</Text>
                                }/>
                                <Descriptions.Item label="角色" children={
                                    <Text type="secondary">{data?.role}</Text>
                                }/>
                            </Descriptions>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card title="更换头像">
                            <Avatar size={64} icon={<UserOutlined/>} src="/placeholder-user.jpg"/>
                            <Button style={{marginTop: 16, marginLeft: 16}}>上传新头像</Button>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card title="修改密码">
                            <Form layout="vertical">
                                <Form.Item label="新密码" name="password">
                                    <Input.Password placeholder="请输入新密码"/>
                                </Form.Item>
                                <Button type="primary">保存</Button>
                            </Form>
                        </Card>
                    </Col>
                    <Col xs={24} md={12} lg={8}>
                        <Card title="查看最后一次登录">
                            <Descriptions
                                column={1}
                                size="small"
                                bordered
                            >
                                <Descriptions.Item label="最后一次登录时间" children={
                                    <Text type="secondary">{data?.last_login_time}</Text>
                                }/>
                                <Descriptions.Item label="最后一次登录IP" children={
                                    <Text type="secondary">{data?.last_login_ip}</Text>
                                }/>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </ProCard>
    );
}