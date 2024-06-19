import {Group, ProCard} from "@ant-design/pro-components";
import {useEffect, useState} from "react";
import {config} from "../config.tsx";
import {Card, Badge, Avatar, Tag, Button} from "antd";

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

    useEffect(
        () => {
            fetch(config.API_URL + "/api/v1/appstore/apps", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("SESSION") || "",
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 0) {
                        setApps(data.data)
                    } else {
                        console.log(data.msg)
                    }
                })
        }, []
    )
    return (
        <>
            <ProCard>
                {apps.map((app, index) => (
                    <Card
                        key={index}
                        style={{marginBottom: 16}}
                        title={app.name}
                        extra={
                            <Badge
                                status={app.is_install ? "success" : "error"}
                                text={app.is_install ? "已安装" : "未安装"}
                            />
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
                                        // Todo 安装函数
                                    }}>安装</Button>
                                    <Button
                                        disabled={!app.is_install}
                                        onClick={() => {
                                        // Todo 卸载函数
                                    }}>卸载</Button>
                                    <Button
                                        disabled={!app.is_install || !app.is_running}
                                        onClick={() => {
                                        // Todo 启动函数
                                    }}>启动</Button>
                                    <Button
                                        disabled={!app.is_install || app.is_running}
                                        onClick={() => {
                                        // Todo 停止函数
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