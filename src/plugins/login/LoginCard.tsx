import {LoginForm, ProFormText} from '@ant-design/pro-components';
import {Tabs} from "antd"
import logo from "../../assets/logo.png"
import {useState} from "react";
import {config} from "../../config.tsx";

export default function Plugin() {
    const [loginType, setLoginType] = useState('account');
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
            placeholder={'密码: 123456'}
            rules={[
                {
                    required: true,
                    message: '请输入密码！',
                },
            ]}
        />
    </>

    return <>
        <LoginForm
            logo={logo}
            title={"LoongPanel"}
            onFinish={async (values) => {
                fetch(config.API_URL + '/api/v1/auth/login', {
                    method: 'POST',
                    body: JSON.stringify(values),
                }).then((response) => {
                    if (response.status === 200) {
                        response.json().then((data) => {
                            localStorage.setItem('SESSION', data.session);
                            window.location.href = '/';
                        });
                    }
                })
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

                ]}
            />
            {loginType === 'account' && (
                <>
                    <ProFormText
                        name="username"
                        fieldProps={{
                            size: 'large',
                        }}
                        placeholder={'账号: admin / user'}
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
                        placeholder={'邮箱: admin@qq.com / user@qq.com'}
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
        </LoginForm>
    </>
}