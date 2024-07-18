import { ProCard } from "@ant-design/pro-components";
import { Card, message, Form, Input, Switch, Button, InputNumber } from "antd"
import { useEffect, useState } from "react";
import { config } from "../config";

type AuthConfig = {
    can_register: boolean;
    can_mail_login: boolean;
}

type PanelLogConfig = {
    debug: boolean;
    save_to_file: boolean;
}

type MailConfig = {
    mail_host: string;
    mail_port: number;
    mail_user: string;
    mail_pass: string;
    mail_from: string;
    mail_ssl: boolean;
    mail_to: string;
    mail_body: string;
    mail_title: string;
}

export default function Page() {
    const [authConfig, setAuthConfig] = useState<AuthConfig>();
    const [panelLogConfig, setPanelLogConfig] = useState<PanelLogConfig>();
    const [mailConfig, setMailConfig] = useState<MailConfig>();

    const [authForm] = Form.useForm();
    const [panelLogForm] = Form.useForm();
    const [mailForm] = Form.useForm();

    const SetMialConfig = (data: MailConfig) => {
        fetch(config.API_URL + "/api/v1/settings/mail", {
            method: "POST",
            body: JSON.stringify(data),
        }).then(res => res.json())
            .then(data => {
                if (data.status != 0) {
                    message.error(data.msg);
                } else {
                    message.success("设置成功");
                    getConfig();
                }
            });
    }

    const SetPanelLogConfig = (data: PanelLogConfig) => {
        fetch(config.API_URL + "/api/v1/settings/log", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
        }).then(res => res.json())
            .then(data => {
                if (data.status != 0) {
                    message.error(data.msg);
                } else {
                    message.success("设置成功");
                    getConfig();
                }
            });
    }

    const SetAuthConfig = (data: AuthConfig) => {
        fetch(config.API_URL + "/api/v1/settings/auth", {
            method: "POST",
            body: JSON.stringify(data),
            credentials: "include",
        }).then(res => res.json())
            .then(data => {
                if (data.status != 0) {
                    message.error(data.msg);
                } else {
                    message.success("设置成功");
                    getConfig();
                }
            });
    }

    const getConfig = () => {
        fetch(config.API_URL + "/api/v1/settings/auth", {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                if (data.status != 0) {
                    message.error("获取配置失败");
                } else {
                    setAuthConfig(data.data);
                    authForm.setFieldsValue(data.data);
                }
            });

        fetch(config.API_URL + "/api/v1/settings/log", {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                if (data.status != 0) {
                    message.error("获取配置失败");
                } else {
                    setPanelLogConfig(data.data);
                    panelLogForm.setFieldsValue(data.data);
                }
            });

        fetch(config.API_URL + "/api/v1/settings/mail", {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => {
                if (data.status != 0) {
                    message.error("获取配置失败");
                } else {
                    setMailConfig(data.data);
                    mailForm.setFieldsValue(data.data);
                }
            });
    }

    useEffect(() => {
        getConfig();
    }, []);

    return (
        <>
            <ProCard>
                <Card title="安全设置">
                    <Form
                        form={authForm}
                        initialValues={authConfig}
                        onFinish={SetAuthConfig}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                    >
                        <Form.Item
                            name="can_register"
                            valuePropName="checked"
                            label="允许注册"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item
                            name="can_mail_login"
                            valuePropName="checked"
                            label="允许邮箱登录"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 2, span: 22 }}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="面板设置">
                    <Form
                        form={panelLogForm}
                        initialValues={panelLogConfig}
                        onFinish={SetPanelLogConfig}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                    >
                        <Form.Item
                            name="debug"
                            valuePropName="checked"
                            label="日志调试模式"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item
                            name="save_to_file"
                            valuePropName="checked"
                            label="日志保存到文件"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 2, span: 22 }}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Card title="邮件设置">
                    <Form
                        form={mailForm}
                        initialValues={mailConfig}
                        onFinish={SetMialConfig}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                    >
                        <Form.Item
                            name="mail_host"
                            label="邮件服务器"
                        >
                            <Input style={{ width: '300px' }} />
                        </Form.Item>
                        <Form.Item
                            name="mail_port"
                            label="邮件端口"
                        >
                            <InputNumber style={{ width: '300px' }} />
                        </Form.Item>
                        <Form.Item
                            name="mail_user"
                            label="邮件用户名"
                        >
                            <Input style={{ width: '300px' }} />
                        </Form.Item>
                        <Form.Item
                            name="mail_pass"
                            label="邮件密码"
                        >
                            <Input.Password style={{ width: '300px' }} />
                        </Form.Item>
                        <Form.Item
                            name="mail_from"
                            label="邮件发送者"
                        >
                            <Input style={{ width: '300px' }} />
                        </Form.Item>
                        <Form.Item
                            name="mail_ssl"
                            valuePropName="checked"
                            label="邮件SSL"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 2, span: 22 }}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </ProCard>
        </>
    )
}