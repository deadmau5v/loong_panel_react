import {Group, ProCard} from "@ant-design/pro-components";
import {useEffect, useState} from "react";
import {config} from "../config.tsx";
import {Card, Badge, Avatar, Tag, Button, message} from "antd";

type App = {
    name: string
    version: string
    tags: string[]
    icon: string
    is_install: boolean
    is_running: boolean
}


export default function Page() {
    const [apps, setApps] = useState<App[]>([])
    const [messageApi, contextHolder] = message.useMessage();

    const getApps = () => {
        fetch(config.API_URL + "/api/v1/appstore/apps", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 0) {
                    setApps(data.data)
                } else {
                    console.log(data.msg)
                }
            })
    }

    useEffect(
        () => {
            getApps()
        }, []
    )
    return (
        <>
            {contextHolder}
            <ProCard>
                {apps.map((app, index) => (
                    <Card
                        key={index}
                        style={{marginBottom: 16}}
                        title={app.name}
                        extra={
                            <>
                                <Group>
                                    <Badge
                                        status={app.is_install ? "success" : "error"}
                                        text={app.is_install ? "已安装" : "未安装"}
                                    />

                                    <Badge
                                        status={app.is_running ? "success" : "error"}
                                        text={app.is_running ? "运行中" : "未运行"}
                                    />
                                </Group>
                            </>

                        }
                    >
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Avatar
                                src={config.API_URL + "/script/icons/" + app.icon}
                                size={100}
                                shape="circle"
                                style={{marginRight: 16}}
                            />
                            <div>
                                <p>版本: {app.is_install ? app.version : "未安装"}</p>
                                <p>标签: {app.tags.map(tag => (
                                    <Tag color="blue" key={tag}>{tag}</Tag>
                                ))}</p>
                                <Group>
                                    <Button
                                        disabled={app.is_install}
                                        onClick={() => {
                                            messageApi.loading("请勿关闭或多次点击！正在安装...")
                                            fetch(config.API_URL + "/api/v1/appstore/app?name=" + app.name, {
                                                method: "POST",
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                credentials: "include"
                                            }).then(response => response.json()).then(
                                                (data) => {
                                                    messageApi.destroy()
                                                    if (data.status !== 0) {
                                                        messageApi.error(data.msg)
                                                    } else {
                                                        messageApi.success("安装成功")
                                                        getApps()
                                                    }
                                                }
                                            )
                                        }}>安装</Button>
                                    <Button
                                        disabled={!app.is_install}
                                        onClick={() => {
                                            messageApi.loading("正在卸载")
                                            fetch(config.API_URL + "/api/v1/appstore/app?name=" + app.name, {
                                                method: "DELETE",
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                credentials: "include"
                                            }).then(response => response.json()).then(
                                                (data) => {
                                                    messageApi.destroy()
                                                    if (data.status !== 0) {
                                                        messageApi.error(data.msg)
                                                    } else {
                                                        messageApi.success("卸载成功")
                                                        getApps()
                                                    }
                                                }
                                            )
                                        }}>卸载</Button>
                                    <Button
                                        disabled={!app.is_install || app.is_running}
                                        onClick={() => {
                                            messageApi.loading("正在启动")
                                            fetch(config.API_URL + "/api/v1/appstore/app/start?name=" + app.name, {
                                                method: "POST",
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                credentials: "include"
                                            }).then(response => response.json()).then(
                                                (data) => {
                                                    messageApi.destroy()
                                                    if (data.status !== 0) {
                                                        messageApi.error(data.msg)
                                                    } else {
                                                        messageApi.success("启动成功")
                                                        getApps()
                                                    }
                                                }
                                            )
                                        }}>启动</Button>
                                    <Button
                                        disabled={!app.is_install || !app.is_running}
                                        onClick={() => {
                                            messageApi.loading("正在停止")
                                            fetch(config.API_URL + "/api/v1/appstore/app/stop?name=" + app.name, {
                                                method: "POST",
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                credentials: "include"
                                            }).then(response => response.json()).then(
                                                (data) => {
                                                    messageApi.destroy()
                                                    if (data.status !== 0) {
                                                        messageApi.error(data.msg)
                                                    } else {
                                                        messageApi.success("停止成功")
                                                        getApps()
                                                    }
                                                }
                                            )
                                        }}>停止</Button>
                                </Group>
                            </div>
                        </div>
                    </Card>
                ))}
            </ProCard>
        </>
    );
}