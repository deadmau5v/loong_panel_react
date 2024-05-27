import {ProForm, ProFormRadio, ProFormText} from '@ant-design/pro-components';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {useContext} from "react";
import {ConfigContext} from "../../config.tsx";
import {NotificationArgsProps, notification} from 'antd';
import {useAuth} from "../AuthContext.tsx";

type Response = {
    session: string
    code: number
    msg: string
}

type NotificationPlacement = NotificationArgsProps['placement'];


export default function Plugin() {
    const {setLogined} = useAuth()
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (placement: NotificationPlacement, msg: string) => {
        api.info({
            message: `登录失败`,
            description: msg,
            icon: <UserOutlined style={{color: 'rgba(255,77,81,0.58)'}}/>,
            placement,
        });
    };
    const config = useContext(ConfigContext);
    const API = config?.API_URL + "/api/v1/auth/login";

    return <>
        {contextHolder}
        <ProFormRadio.Group
            style={{
                margin: 16,
            }}
            radioType="button"
        />
        <ProForm
            title="LoongPanel"
            onFinish={async (values) => {
                fetch(API, {
                    method: 'POST',
                    body: JSON.stringify(values),
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': document.cookie,
                        'Authorization': 'Bearer ' + document.cookie ? document.cookie.split("=")[1] : ''

                    }
                }).then(async res => {
                    if (res.status === 200) {
                        // 设置Cookie
                        const data: Response = await res.json()
                        if (data.code === 200) {
                            document.cookie = `SESSION=${data.session}`
                            window.location.href = "/"
                        }
                        setLogined(true)
                    } else {
                        const data: Response = await res.json()
                        openNotification("top", data.msg)
                    }
                })
            }}
        >
            <ProFormText
                name="username"
                fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={'prefixIcon'}/>,
                }}
                placeholder={'用户名: admin or user'}
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
            />
            <ProFormText.Password
                name="password"
                fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={'prefixIcon'}/>,
                }}
                placeholder={'密码: 123456'}
                rules={[
                    {
                        required: true,
                        message: '请输入密码！',
                    },
                ]}
            />
        </ProForm>
    </>
}