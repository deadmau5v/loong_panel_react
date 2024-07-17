import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Tabs } from "antd"
import logo from "../../assets/logo.png"
import { useState } from "react";
import { config } from "../../config.tsx";

export default function Plugin() {
    const [loginType, setLoginType] = useState('account');
    const [MsgApi, contextHolder] = message.useMessage();
    const PasswordForm = <>
        <ProFormText.Password
            name="password"
            fieldProps={{
                size: 'large',
                strengthText:
                    '为了您的数据安全，请设置长度6位以上的密码!',
                statusRender: (value) => {
                    const getStatus = () => {
                        if (value && value.length > 12) {
                            return 'ok';
                        }
                        if (value && value.length > 6) {
                            return 'pass';
                        }
                        return 'poor';
                    };
                    const status = getStatus();
                    if (status === 'pass') {
                        return (
                            <div>
                                强度：中
                            </div>
                        );
                    }
                    if (status === 'ok') {
                        return (
                            <div>
                                强度：强
                            </div>
                        );
                    }
                    return (
                        <div> 强度：弱</div>
                    );
                },
            }}
            placeholder={'密码'}
            rules={[
                {
                    required: true,
                    message: '请输入密码！',
                },
            ]}
        />
    </>

    return <>
        {contextHolder}
        <LoginForm
            logo={logo}
            title={"LoongPanel"}
            onFinish={async (values) => {
                if (loginType == 'register') {
                    // 注册逻辑
                    fetch(config.API_URL + '/api/v1/auth/register', {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    }).then(r => r.json()).then(
                        (data: { status: number, msg: string }) => {
                            if (data.status != 0) {
                                MsgApi.error(data.msg);
                            } else {
                                MsgApi.success("注册成功");
                                setLoginType('account');
                            }
                        }
                    );
                } else {
                    // 登录逻辑
                    fetch(config.API_URL + '/api/v1/auth/login', {
                        method: 'POST',
                        body: JSON.stringify(values),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    }).then(r => r.json()).then(
                        (data: { status: number, msg: string }) => {
                            if (data.status != 0) {
                                MsgApi.error(data.msg);
                            } else {
                                MsgApi.success("登录成功");
                                localStorage.setItem("isLogin", "true")
                                window.location.href = "/"
                            }
                        }
                    );
                }
            }}
        >
            <Tabs
                centered
                activeKey={loginType}
                onChange={(activeKey) => setLoginType(activeKey)}
                items={[
                    {
                        key: 'account',
                        label: '账号登录',
                    },
                    {
                        key: 'mail',
                        label: '邮箱登录',
                    },
                    {
                        key: 'register',
                        label: '注册',
                    }

                ]}
            />
            {loginType === 'account' && (
                <>
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                        }}
                        placeholder={'账号'}
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    />
                    {PasswordForm}
                </>
            )}
            {loginType === 'mail' && (
                <>
                    <ProFormText
                        name="email"
                        fieldProps={{
                            size: 'large',
                        }}
                        placeholder={'邮箱'}
                        rules={[
                            {
                                required: true,
                                message: '请输入邮箱!',
                            },
                        ]}
                    />
                    {PasswordForm}

                </>
            )}
            {loginType === 'register' && (
                <>
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                        }}
                        placeholder={'账号'}
                        required={true}
                    />
                    <ProFormText
                        name="email"
                        fieldProps={{
                            size: 'large',
                        }}
                        placeholder={'邮箱'}
                        required={false}
                    />
                    <ProFormText
                        name="phone"
                        required={false}
                        fieldProps={{
                            size: 'large',
                        }}
                        placeholder={'手机号'}
                    />
                    {PasswordForm}
                </>
            )}
        </LoginForm>
    </>
}