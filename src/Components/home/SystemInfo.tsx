import {Card, Descriptions} from "antd";
import {ConfigContext} from "../../config.tsx";
import {useContext, useEffect, useState} from "react";

type SystemInfo = {
    system_arch: string,
    system_public_ip: string,
    system_cpu_name: string,
    system_linux_version: string,
    system_run_time: string
}

export default function Plugin() {
    const config = useContext(ConfigContext);
    const API = `${config?.API_URL}/api/v1/status/system_info`;
    const [systemInfo, setSystemInfo] = useState<SystemInfo>({
        system_arch: "",
        system_public_ip: "",
        system_cpu_name: "",
        system_linux_version: "",
        system_run_time: ""
    });

    const fetchSystemInfo = async () => {
        const response = await fetch(API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });
        if (response.ok) {
            const data = await response.json();
            setSystemInfo(data);
        }
    }

    useEffect(() => {
        fetchSystemInfo();
    }, [])

    return (
        <>
            <Card id="SystemInfo" className="card" title="系统信息">
                <Card.Meta
                    description={
                        <Descriptions
                            size="small"
                            column={1}
                        >
                            <Descriptions.Item label="公网 IP">{systemInfo.system_public_ip}</Descriptions.Item>
                            <Descriptions.Item label="系统架构">{systemInfo.system_arch}</Descriptions.Item>
                            <Descriptions.Item label="处理器名">{systemInfo.system_cpu_name}</Descriptions.Item>
                            <Descriptions.Item label="内核版本">{systemInfo.system_linux_version}</Descriptions.Item>
                            <Descriptions.Item label="运行时间">{systemInfo.system_run_time}</Descriptions.Item>
                        </Descriptions>
                    }
                />
            </Card>
        </>
    )
}